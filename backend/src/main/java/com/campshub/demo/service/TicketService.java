package com.campshub.demo.service;

import com.campshub.demo.dto.TicketRequest;
import com.campshub.demo.exception.InvalidOperationException;
import com.campshub.demo.exception.ResourceNotFoundException;
import com.campshub.demo.model.*;
import com.campshub.demo.model.enums.NotificationType;
import com.campshub.demo.model.enums.TicketStatus;
import com.campshub.demo.model.enums.UserRole;
import com.campshub.demo.repository.FacilityRepository;
import com.campshub.demo.repository.TicketRepository;
import com.campshub.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final FacilityRepository facilityRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public Ticket createTicket(TicketRequest request, MultipartFile[] images, User reporter) {
        Facility facility = facilityRepository.findById(request.getFacilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found"));

        Ticket ticket = new Ticket();
        ticket.setFacilityId(request.getFacilityId());
        ticket.setFacilityName(facility.getName());
        ticket.setReporterId(reporter.getId());
        ticket.setReporterName(reporter.getName());
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(Instant.now());
        ticket.setUpdatedAt(Instant.now());

        // Handle image uploads (max 3)
        if (images != null) {
            List<String> imageUrls = uploadImages(images);
            ticket.setImageUrls(imageUrls);
        }

        Ticket saved = ticketRepository.save(ticket);

        notificationService.createNotification(reporter.getId(),
                "Ticket '" + ticket.getTitle() + "' has been created successfully.",
                NotificationType.TICKET_CREATED, saved.getId());

        return saved;
    }

    public Ticket assignTechnician(String ticketId, String technicianId) {
        Ticket ticket = getTicketById(ticketId);

        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found"));

        if (technician.getRole() != UserRole.TECHNICIAN) {
            throw new InvalidOperationException("User is not a technician");
        }

        ticket.setAssignedTechnicianId(technicianId);
        ticket.setAssignedTechnicianName(technician.getName());
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        ticket.setUpdatedAt(Instant.now());

        Ticket saved = ticketRepository.save(ticket);

        notificationService.createNotification(technicianId,
                "You have been assigned to ticket: " + ticket.getTitle(),
                NotificationType.TICKET_ASSIGNED, saved.getId());

        notificationService.createNotification(ticket.getReporterId(),
                "A technician has been assigned to your ticket: " + ticket.getTitle(),
                NotificationType.TICKET_ASSIGNED, saved.getId());

        return saved;
    }

    public Ticket updateTicketStatus(String ticketId, TicketStatus newStatus) {
        Ticket ticket = getTicketById(ticketId);

        // Validate workflow transitions
        validateStatusTransition(ticket.getStatus(), newStatus);

        ticket.setStatus(newStatus);
        ticket.setUpdatedAt(Instant.now());

        Ticket saved = ticketRepository.save(ticket);

        notificationService.createNotification(ticket.getReporterId(),
                "Ticket '" + ticket.getTitle() + "' status updated to " + newStatus,
                NotificationType.TICKET_STATUS_UPDATED, saved.getId());

        return saved;
    }

    public Ticket addComment(String ticketId, String text, User author) {
        Ticket ticket = getTicketById(ticketId);

        Comment comment = new Comment();
        comment.setAuthorId(author.getId());
        comment.setAuthorName(author.getName());
        comment.setText(text);
        comment.setCreatedAt(Instant.now());

        ticket.getComments().add(comment);
        ticket.setUpdatedAt(Instant.now());

        Ticket saved = ticketRepository.save(ticket);

        // Notify reporter if someone else comments
        if (!author.getId().equals(ticket.getReporterId())) {
            notificationService.createNotification(ticket.getReporterId(),
                    author.getName() + " commented on ticket: " + ticket.getTitle(),
                    NotificationType.TICKET_COMMENTED, saved.getId());
        }

        // Notify assigned technician if someone else comments
        if (ticket.getAssignedTechnicianId() != null &&
                !author.getId().equals(ticket.getAssignedTechnicianId())) {
            notificationService.createNotification(ticket.getAssignedTechnicianId(),
                    author.getName() + " commented on ticket: " + ticket.getTitle(),
                    NotificationType.TICKET_COMMENTED, saved.getId());
        }

        return saved;
    }

    public Ticket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getTicketsByReporter(String reporterId) {
        return ticketRepository.findByReporterId(reporterId);
    }

    public List<Ticket> getTicketsByTechnician(String technicianId) {
        return ticketRepository.findByAssignedTechnicianId(technicianId);
    }

    public List<Ticket> getTicketsByStatus(TicketStatus status) {
        return ticketRepository.findByStatus(status);
    }

    private void validateStatusTransition(TicketStatus current, TicketStatus target) {
        boolean valid = switch (current) {
            case OPEN -> target == TicketStatus.IN_PROGRESS;
            case IN_PROGRESS -> target == TicketStatus.RESOLVED;
            case RESOLVED -> target == TicketStatus.CLOSED;
            case CLOSED -> false;
        };

        if (!valid) {
            throw new InvalidOperationException(
                    "Cannot transition from " + current + " to " + target);
        }
    }

    private List<String> uploadImages(MultipartFile[] images) {
        if (images.length > 3) {
            throw new InvalidOperationException("Maximum 3 images allowed per ticket");
        }

        List<String> imageUrls = new ArrayList<>();
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            for (MultipartFile image : images) {
                if (image != null && !image.isEmpty()) {
                    String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
                    Path targetLocation = uploadPath.resolve(fileName);
                    Files.copy(image.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
                    imageUrls.add("/uploads/" + fileName);
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload images: " + e.getMessage());
        }

        return imageUrls;
    }
}

package com.campshub.demo.service;

import com.campshub.demo.dto.BookingRequest;
import com.campshub.demo.exception.BookingConflictException;
import com.campshub.demo.exception.InvalidOperationException;
import com.campshub.demo.exception.ResourceNotFoundException;
import com.campshub.demo.model.Booking;
import com.campshub.demo.model.Facility;
import com.campshub.demo.model.User;
import com.campshub.demo.model.enums.BookingStatus;
import com.campshub.demo.model.enums.NotificationType;
import com.campshub.demo.repository.BookingRepository;
import com.campshub.demo.repository.FacilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final FacilityRepository facilityRepository;
    private final NotificationService notificationService;

    public Booking createBooking(BookingRequest request, User user) {
        // Validate facility exists
        Facility facility = facilityRepository.findById(request.getFacilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found"));

        // Validate time range
        if (request.getStartTime().isAfter(request.getEndTime())) {
            throw new InvalidOperationException("Start time must be before end time");
        }

        if (request.getStartTime().isBefore(Instant.now())) {
            throw new InvalidOperationException("Cannot book in the past");
        }

        // Check for conflicts
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                request.getFacilityId(), request.getStartTime(), request.getEndTime());
        if (!conflicts.isEmpty()) {
            throw new BookingConflictException(
                    "Time slot conflicts with existing booking(s). Found " + conflicts.size() + " conflict(s).");
        }

        Booking booking = new Booking();
        booking.setFacilityId(request.getFacilityId());
        booking.setFacilityName(facility.getName());
        booking.setUserId(user.getId());
        booking.setUserName(user.getName());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setStatus(BookingStatus.PENDING);
        booking.setCreatedAt(Instant.now());
        booking.setUpdatedAt(Instant.now());

        Booking saved = bookingRepository.save(booking);

        // Notify user
        notificationService.createNotification(user.getId(),
                "Your booking for " + facility.getName() + " has been submitted and is pending approval.",
                NotificationType.BOOKING_CREATED, saved.getId());

        return saved;
    }

    public Booking approveBooking(String bookingId, String reason, User admin) {
        Booking booking = getBookingById(bookingId);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new InvalidOperationException("Only PENDING bookings can be approved");
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setAdminReason(reason);
        booking.setAdminId(admin.getId());
        booking.setUpdatedAt(Instant.now());

        Booking saved = bookingRepository.save(booking);

        notificationService.createNotification(booking.getUserId(),
                "Your booking for " + booking.getFacilityName() + " has been APPROVED." +
                        (reason != null ? " Reason: " + reason : ""),
                NotificationType.BOOKING_APPROVED, saved.getId());

        return saved;
    }

    public Booking rejectBooking(String bookingId, String reason, User admin) {
        Booking booking = getBookingById(bookingId);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new InvalidOperationException("Only PENDING bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setAdminReason(reason);
        booking.setAdminId(admin.getId());
        booking.setUpdatedAt(Instant.now());

        Booking saved = bookingRepository.save(booking);

        notificationService.createNotification(booking.getUserId(),
                "Your booking for " + booking.getFacilityName() + " has been REJECTED." +
                        (reason != null ? " Reason: " + reason : ""),
                NotificationType.BOOKING_REJECTED, saved.getId());

        return saved;
    }

    public Booking cancelBooking(String bookingId, User user) {
        Booking booking = getBookingById(bookingId);

        if (!booking.getUserId().equals(user.getId())) {
            throw new InvalidOperationException("You can only cancel your own bookings");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new InvalidOperationException("Booking is already cancelled");
        }

        if (booking.getStatus() == BookingStatus.REJECTED) {
            throw new InvalidOperationException("Cannot cancel a rejected booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(Instant.now());

        Booking saved = bookingRepository.save(booking);

        notificationService.createNotification(booking.getUserId(),
                "Your booking for " + booking.getFacilityName() + " has been CANCELLED.",
                NotificationType.BOOKING_CANCELLED, saved.getId());

        return saved;
    }

    public Booking getBookingById(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }
}

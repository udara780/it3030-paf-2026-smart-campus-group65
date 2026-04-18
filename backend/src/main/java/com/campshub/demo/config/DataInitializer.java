package com.campshub.demo.config;

import com.campshub.demo.model.Booking;
import com.campshub.demo.model.Facility;
import com.campshub.demo.model.Ticket;
import com.campshub.demo.model.User;
import com.campshub.demo.model.enums.BookingStatus;
import com.campshub.demo.model.enums.FacilityStatus;
import com.campshub.demo.model.enums.FacilityType;
import com.campshub.demo.model.enums.TicketPriority;
import com.campshub.demo.model.enums.TicketStatus;
import com.campshub.demo.model.enums.UserRole;
import com.campshub.demo.repository.BookingRepository;
import com.campshub.demo.repository.FacilityRepository;
import com.campshub.demo.repository.TicketRepository;
import com.campshub.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

// @Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final FacilityRepository facilityRepository;
    private final BookingRepository bookingRepository;
    private final TicketRepository ticketRepository;

    @Override
    public void run(String... args) {
        // Only initialize if database is empty
        if (userRepository.count() == 0) {
            initializeUsers();
            initializeFacilities();
            initializeBookings();
            initializeTickets();
            System.out.println("Database initialized with sample data");
        }
    }

    private void initializeUsers() {
        List<User> users = List.of(
            new User("demo-user", "user@campshub.demo", "Demo User", null, UserRole.USER, Instant.now(), Instant.now()),
            new User("demo-admin", "admin@campshub.demo", "Demo Admin", null, UserRole.ADMIN, Instant.now(), Instant.now()),
            new User("demo-technician", "technician@campshub.demo", "Demo Technician", null, UserRole.TECHNICIAN, Instant.now(), Instant.now())
        );
        userRepository.saveAll(users);
    }

    private void initializeFacilities() {
        List<Facility> facilities = List.of(
            new Facility(null, "Main Conference Hall", FacilityType.ROOM, 50, "Building A, Floor 2", "Large conference hall with projector and whiteboard", FacilityStatus.ACTIVE, null, Instant.now(), Instant.now()),
            new Facility(null, "Computer Lab 1", FacilityType.LAB, 30, "Building B, Floor 1", "Computer lab with 30 workstations", FacilityStatus.ACTIVE, null, Instant.now(), Instant.now()),
            new Facility(null, "Physics Lab", FacilityType.LAB, 25, "Science Building, Floor 3", "Physics laboratory with equipment", FacilityStatus.ACTIVE, null, Instant.now(), Instant.now()),
            new Facility(null, "Projector System A", FacilityType.EQUIPMENT, 1, "Building A, Floor 2", "Portable projector system", FacilityStatus.ACTIVE, null, Instant.now(), Instant.now())
        );
        facilityRepository.saveAll(facilities);
    }

    private void initializeBookings() {
        User user = userRepository.findById("demo-user").orElse(null);
        Facility facility = facilityRepository.findAll().get(0);
        
        if (user != null && facility != null) {
            List<Booking> bookings = List.of(
                new Booking(null, facility.getId(), user.getId(), user.getName(), facility.getName(), Instant.now().plusSeconds(86400), Instant.now().plusSeconds(86400 + 7200), "Team meeting", BookingStatus.APPROVED, null, null, Instant.now(), Instant.now()),
                new Booking(null, facility.getId(), user.getId(), user.getName(), facility.getName(), Instant.now().plusSeconds(259200), Instant.now().plusSeconds(259200 + 10800), "Presentation", BookingStatus.PENDING, null, null, Instant.now(), Instant.now())
            );
            bookingRepository.saveAll(bookings);
        }
    }

    private void initializeTickets() {
        User user = userRepository.findById("demo-user").orElse(null);
        Facility facility = facilityRepository.findAll().get(1);
        
        if (user != null && facility != null) {
            List<Ticket> tickets = List.of(
                new Ticket(null, facility.getId(), facility.getName(), user.getId(), user.getName(), null, null, "Air conditioning not working", "The AC in the lab is not cooling properly", TicketStatus.OPEN, TicketPriority.MEDIUM, new java.util.ArrayList<>(), new java.util.ArrayList<>(), Instant.now(), Instant.now()),
                new Ticket(null, facility.getId(), facility.getName(), user.getId(), user.getName(), null, null, "Projector needs replacement", "Projector bulb is burnt out", TicketStatus.IN_PROGRESS, TicketPriority.HIGH, new java.util.ArrayList<>(), new java.util.ArrayList<>(), Instant.now().minusSeconds(86400), Instant.now())
            );
            ticketRepository.saveAll(tickets);
        }
    }
}

package com.campshub.demo.config;

import java.time.Instant;
import java.util.List;

import org.springframework.boot.CommandLineRunner;

import com.campshub.demo.model.User;
import com.campshub.demo.model.enums.UserRole;
import com.campshub.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

// @Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        // Only initialize if database is empty
        if (userRepository.count() == 0) {
            initializeUsers();
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

    private void initializeTickets() {
        // Sample ticket data initialization can be done here
        // For now, keeping it simple since uadara doesn't have facilities
    }
}

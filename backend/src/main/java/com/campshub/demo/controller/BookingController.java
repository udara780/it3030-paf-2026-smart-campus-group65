package com.campshub.demo.controller;

import com.campshub.demo.dto.BookingActionRequest;
import com.campshub.demo.dto.BookingRequest;
import com.campshub.demo.model.Booking;
import com.campshub.demo.model.User;
import com.campshub.demo.model.enums.BookingStatus;
import com.campshub.demo.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(@Valid @RequestBody BookingRequest request,
                                                  @AuthenticationPrincipal User user) {
        Booking booking = bookingService.createBooking(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings(
            @RequestParam(required = false) BookingStatus status) {
        if (status != null) {
            return ResponseEntity.ok(bookingService.getBookingsByStatus(status));
        }
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getUserBookings(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Booking> approveBooking(@PathVariable String id,
                                                   @RequestBody(required = false) BookingActionRequest request,
                                                   @AuthenticationPrincipal User admin) {
        String reason = request != null ? request.getReason() : null;
        return ResponseEntity.ok(bookingService.approveBooking(id, reason, admin));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Booking> rejectBooking(@PathVariable String id,
                                                  @RequestBody(required = false) BookingActionRequest request,
                                                  @AuthenticationPrincipal User admin) {
        String reason = request != null ? request.getReason() : null;
        return ResponseEntity.ok(bookingService.rejectBooking(id, reason, admin));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(@PathVariable String id,
                                                  @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, user));
    }
}

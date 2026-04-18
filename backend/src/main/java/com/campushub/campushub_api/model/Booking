package com.campshub.demo.model;

import com.campshub.demo.model.enums.BookingStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    private String facilityId;

    private String userId;

    private String userName;

    private String facilityName;

    private Instant startTime;

    private Instant endTime;

    private String purpose;

    private BookingStatus status = BookingStatus.PENDING;

    private String adminReason; // reason for approval/rejection

    private String adminId;

    private Instant createdAt;

    private Instant updatedAt;
}

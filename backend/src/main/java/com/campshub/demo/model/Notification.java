package com.campshub.demo.model;

import com.campshub.demo.model.enums.NotificationType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private String userId;

    private String message;

    private NotificationType type;

    private String referenceId; // bookingId or ticketId

    private boolean read = false;

    private Instant createdAt;
}

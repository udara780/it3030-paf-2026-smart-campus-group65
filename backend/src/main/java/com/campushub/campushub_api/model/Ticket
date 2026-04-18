package com.campshub.demo.model;

import com.campshub.demo.model.enums.TicketPriority;
import com.campshub.demo.model.enums.TicketStatus;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {

    @Id
    private String id;

    private String facilityId;

    private String facilityName;

    private String reporterId;

    private String reporterName;

    private String assignedTechnicianId;

    private String assignedTechnicianName;

    private String title;

    private String description;

    private TicketStatus status = TicketStatus.OPEN;

    private TicketPriority priority = TicketPriority.MEDIUM;

    private List<String> imageUrls = new ArrayList<>(); // max 3

    private List<Comment> comments = new ArrayList<>();

    private Instant createdAt;

    private Instant updatedAt;
}

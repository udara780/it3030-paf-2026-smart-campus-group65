package com.campshub.demo.model;

import com.campshub.demo.model.enums.FacilityStatus;
import com.campshub.demo.model.enums.FacilityType;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "facilities")
public class Facility {

    @Id
    private String id;

    private String name;

    private FacilityType type; // ROOM, LAB, EQUIPMENT

    private int capacity;

    private String location;

    private String description;

    private FacilityStatus status = FacilityStatus.ACTIVE;

    private List<AvailabilityWindow> availabilityWindows;

    private Instant createdAt;

    private Instant updatedAt;
}

package com.campshub.demo.dto;

import com.campshub.demo.model.AvailabilityWindow;
import com.campshub.demo.model.enums.FacilityStatus;
import com.campshub.demo.model.enums.FacilityType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class FacilityRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Type is required")
    private FacilityType type;

    @Min(value = 1, message = "Capacity must be at least 1")
    private int capacity;

    @NotBlank(message = "Location is required")
    private String location;

    private String description;

    private FacilityStatus status;

    private List<AvailabilityWindow> availabilityWindows;
}

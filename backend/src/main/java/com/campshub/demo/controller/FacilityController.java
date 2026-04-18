package com.campshub.demo.controller;

import com.campshub.demo.dto.FacilityRequest;
import com.campshub.demo.model.Facility;
import com.campshub.demo.model.enums.FacilityStatus;
import com.campshub.demo.model.enums.FacilityType;
import com.campshub.demo.service.FacilityService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")
@RequiredArgsConstructor
public class FacilityController {

    private final FacilityService facilityService;

    @PostMapping
    public ResponseEntity<Facility> createFacility(@Valid @RequestBody FacilityRequest request) {
        Facility facility = facilityService.createFacility(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(facility);
    }

    @GetMapping
    public ResponseEntity<List<Facility>> getAllFacilities(
            @RequestParam(required = false) FacilityType type,
            @RequestParam(required = false) FacilityStatus status,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String name) {

        List<Facility> facilities;
        if (type != null || status != null || location != null || minCapacity != null || name != null) {
            facilities = facilityService.searchFacilities(type, status, location, minCapacity, name);
        } else {
            facilities = facilityService.getAllFacilities();
        }
        return ResponseEntity.ok(facilities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Facility> getFacilityById(@PathVariable String id) {
        return ResponseEntity.ok(facilityService.getFacilityById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Facility> updateFacility(@PathVariable String id,
                                                    @Valid @RequestBody FacilityRequest request) {
        return ResponseEntity.ok(facilityService.updateFacility(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFacility(@PathVariable String id) {
        facilityService.deleteFacility(id);
        return ResponseEntity.noContent().build();
    }
}

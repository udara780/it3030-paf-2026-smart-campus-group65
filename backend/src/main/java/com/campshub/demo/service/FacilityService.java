package com.campshub.demo.service;

import com.campshub.demo.dto.FacilityRequest;
import com.campshub.demo.exception.ResourceNotFoundException;
import com.campshub.demo.model.Facility;
import com.campshub.demo.model.enums.FacilityStatus;
import com.campshub.demo.model.enums.FacilityType;
import com.campshub.demo.repository.FacilityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FacilityService {

    private final FacilityRepository facilityRepository;

    public Facility createFacility(FacilityRequest request) {
        Facility facility = new Facility();
        facility.setName(request.getName());
        facility.setType(request.getType());
        facility.setCapacity(request.getCapacity());
        facility.setLocation(request.getLocation());
        facility.setDescription(request.getDescription());
        facility.setStatus(request.getStatus() != null ? request.getStatus() : FacilityStatus.ACTIVE);
        facility.setAvailabilityWindows(request.getAvailabilityWindows());
        facility.setCreatedAt(Instant.now());
        facility.setUpdatedAt(Instant.now());
        return facilityRepository.save(facility);
    }

    public Facility updateFacility(String id, FacilityRequest request) {
        Facility facility = getFacilityById(id);
        facility.setName(request.getName());
        facility.setType(request.getType());
        facility.setCapacity(request.getCapacity());
        facility.setLocation(request.getLocation());
        facility.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            facility.setStatus(request.getStatus());
        }
        facility.setAvailabilityWindows(request.getAvailabilityWindows());
        facility.setUpdatedAt(Instant.now());
        return facilityRepository.save(facility);
    }

    public void deleteFacility(String id) {
        if (!facilityRepository.existsById(id)) {
            throw new ResourceNotFoundException("Facility not found with id: " + id);
        }
        facilityRepository.deleteById(id);
    }

    public Facility getFacilityById(String id) {
        return facilityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found with id: " + id));
    }

    public List<Facility> getAllFacilities() {
        return facilityRepository.findAll();
    }

    public List<Facility> searchFacilities(FacilityType type, FacilityStatus status,
                                           String location, Integer minCapacity, String name) {
        if (name != null && !name.isEmpty()) {
            return facilityRepository.findByNameContainingIgnoreCase(name);
        }

        // If specific filters are provided, apply them
        List<Facility> results = facilityRepository.findAll();

        if (type != null) {
            results = results.stream().filter(f -> f.getType() == type).toList();
        }
        if (status != null) {
            results = results.stream().filter(f -> f.getStatus() == status).toList();
        }
        if (location != null && !location.isEmpty()) {
            results = results.stream()
                    .filter(f -> f.getLocation().toLowerCase().contains(location.toLowerCase()))
                    .toList();
        }
        if (minCapacity != null && minCapacity > 0) {
            results = results.stream().filter(f -> f.getCapacity() >= minCapacity).toList();
        }

        return results;
    }
}

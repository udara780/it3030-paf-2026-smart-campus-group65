package com.campshub.demo.repository;

import com.campshub.demo.model.Facility;
import com.campshub.demo.model.enums.FacilityStatus;
import com.campshub.demo.model.enums.FacilityType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacilityRepository extends MongoRepository<Facility, String> {

    List<Facility> findByType(FacilityType type);

    List<Facility> findByStatus(FacilityStatus status);

    List<Facility> findByLocation(String location);

    List<Facility> findByCapacityGreaterThanEqual(int capacity);

    @Query("{ $and: [ " +
           "{ $or: [ { 'type': ?0 }, { ?0: null } ] }, " +
           "{ $or: [ { 'status': ?1 }, { ?1: null } ] }, " +
           "{ $or: [ { 'location': { $regex: ?2, $options: 'i' } }, { ?2: '' } ] }, " +
           "{ $or: [ { 'capacity': { $gte: ?3 } }, { ?3: 0 } ] } " +
           "] }")
    List<Facility> searchFacilities(FacilityType type, FacilityStatus status, String location, int capacity);

    List<Facility> findByNameContainingIgnoreCase(String name);
}

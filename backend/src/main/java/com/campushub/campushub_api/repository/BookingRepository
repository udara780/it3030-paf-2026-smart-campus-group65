package com.campshub.demo.repository;

import com.campshub.demo.model.Booking;
import com.campshub.demo.model.enums.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByUserId(String userId);

    List<Booking> findByFacilityId(String facilityId);

    List<Booking> findByStatus(BookingStatus status);

    // Find overlapping bookings for conflict detection
    @Query("{ 'facilityId': ?0, 'status': { $in: ['PENDING', 'APPROVED'] }, " +
           "'startTime': { $lt: ?2 }, 'endTime': { $gt: ?1 } }")
    List<Booking> findConflictingBookings(String facilityId, Instant startTime, Instant endTime);

    List<Booking> findByUserIdAndStatus(String userId, BookingStatus status);
}

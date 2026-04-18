package com.campshub.demo.repository;

import com.campshub.demo.model.Ticket;
import com.campshub.demo.model.enums.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {

    List<Ticket> findByReporterId(String reporterId);

    List<Ticket> findByAssignedTechnicianId(String technicianId);

    List<Ticket> findByStatus(TicketStatus status);

    List<Ticket> findByFacilityId(String facilityId);
}

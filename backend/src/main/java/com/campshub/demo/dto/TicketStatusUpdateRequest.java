package com.campshub.demo.dto;

import com.campshub.demo.model.enums.TicketStatus;
import lombok.Data;

@Data
public class TicketStatusUpdateRequest {
    private TicketStatus status;
}

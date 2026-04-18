package com.campshub.demo.dto;

import com.campshub.demo.model.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String id;
    private String email;
    private String name;
    private String picture;
    private UserRole role;
}

package com.campshub.demo.service;

import com.campshub.demo.config.JwtUtil;
import com.campshub.demo.dto.AuthResponse;
import com.campshub.demo.model.User;
import com.campshub.demo.model.enums.UserRole;
import com.campshub.demo.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Value("${app.google.client-id}")
    private String googleClientId;

    public AuthResponse authenticateWithGoogle(String googleToken) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), GsonFactory.getDefaultInstance())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(googleToken);
            if (idToken == null) {
                throw new RuntimeException("Invalid Google token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String picture = (String) payload.get("picture");

            // Find or create user
            Optional<User> existingUser = userRepository.findByEmail(email);
            User user;

            if (existingUser.isPresent()) {
                user = existingUser.get();
                user.setName(name);
                user.setPicture(picture);
                user.setUpdatedAt(Instant.now());
                user = userRepository.save(user);
            } else {
                user = new User();
                user.setEmail(email);
                user.setName(name);
                user.setPicture(picture);
                user.setRole(UserRole.USER);
                user.setCreatedAt(Instant.now());
                user.setUpdatedAt(Instant.now());
                user = userRepository.save(user);
            }

            // Generate JWT
            String jwt = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());

            return new AuthResponse(jwt, user.getId(), user.getEmail(),
                    user.getName(), user.getPicture(), user.getRole());

        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed: " + e.getMessage());
        }
    }

    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}

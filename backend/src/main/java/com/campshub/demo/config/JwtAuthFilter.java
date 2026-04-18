package com.campshub.demo.config;

import com.campshub.demo.model.User;
import com.campshub.demo.model.enums.UserRole;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String token = extractToken(request);

        if (token != null) {
            String userId;
            String role;

            // Handle demo tokens
            if (token.startsWith("demo-")) {
                String[] parts = token.split("-");
                // parts[1] could be "user", "admin", "technician" — or garbage like "token"
                String rolePart = parts.length > 1 ? parts[1].toUpperCase() : "USER";

                // Guard: only accept valid roles, default to USER otherwise
                try {
                    UserRole.valueOf(rolePart); // validate it exists
                    role = rolePart;
                } catch (IllegalArgumentException e) {
                    role = "USER"; // fallback for "demo-token" or any unrecognised suffix
                }
                userId = "demo-" + role.toLowerCase();
            } else if (jwtUtil.validateToken(token)) {
                // Handle valid JWT tokens
                userId = jwtUtil.getUserIdFromToken(token);
                role = jwtUtil.getRoleFromToken(token);
            } else {
                // Invalid token, skip authentication
                filterChain.doFilter(request, response);
                return;
            }

            // Create user object
            User user = new User(
                userId,
                userId.contains("@") ? userId : userId + "@campshub.demo",
                role.charAt(0) + role.substring(1).toLowerCase(),
                null,
                UserRole.valueOf(role),
                Instant.now(),
                Instant.now()
            );

            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    user,
                    null,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}

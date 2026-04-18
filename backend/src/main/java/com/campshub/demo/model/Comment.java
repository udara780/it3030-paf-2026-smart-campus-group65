package com.campshub.demo.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    private String authorId;
    private String authorName;
    private String text;
    private Instant createdAt;
}

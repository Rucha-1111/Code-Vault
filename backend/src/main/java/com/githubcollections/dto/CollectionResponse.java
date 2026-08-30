package com.githubcollections.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CollectionResponse {
    private Long id;
    private String name;
    private String icon;
    private long itemCount;
    private LocalDateTime createdAt;
}

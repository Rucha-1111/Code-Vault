package com.githubcollections.dto;

import com.githubcollections.model.ItemType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class SavedItemResponse {
    private Long id;
    private ItemType itemType;
    private String title;
    private String subtitle;
    private String avatarUrl;
    private String htmlUrl;
    private String meta;
    private LocalDateTime savedAt;
    private Long collectionId;
    private String collectionName;
}

package com.githubcollections.dto;

import com.githubcollections.model.ItemType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SavedItemRequest {
    @NotNull(message = "itemType is required (USER or REPOSITORY)")
    private ItemType itemType;

    @NotBlank(message = "title is required")
    private String title;

    private String subtitle;
    private String avatarUrl;
    private String htmlUrl;
    private String meta;
}

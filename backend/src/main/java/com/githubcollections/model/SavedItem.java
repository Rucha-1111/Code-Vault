package com.githubcollections.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "saved_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SavedItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collection_id", nullable = false)
    @JsonIgnore
    private Collection collection;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemType itemType;

    // login (for users) or full_name (for repos)
    @Column(nullable = false, length = 255)
    private String title;

    // bio (for users) or description (for repos)
    @Column(length = 1000)
    private String subtitle;

    private String avatarUrl;

    private String htmlUrl;

    // Extra display info, e.g. "⭐ 1200 · JavaScript" for repos, "👥 340 followers" for users
    private String meta;

    private LocalDateTime savedAt = LocalDateTime.now();
}

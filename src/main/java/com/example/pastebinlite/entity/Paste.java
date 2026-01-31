package com.example.pastebinlite.entity;
/**
Author:verma
Date : 27 Jan 2026
time :9:30:52 pm
*/

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "pastes")
public class Paste {

    @Id
    private String id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private Instant expiresAt;

    private Integer maxViews;

    @Column(nullable = false)
    private int viewCount = 0;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public boolean isExpired(Instant now) {
        return expiresAt != null && now.isAfter(expiresAt);
    }

    public boolean isViewLimitExceeded() {
        return maxViews != null && viewCount >= maxViews;
    }

    // Getters & setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }

    public Integer getMaxViews() { return maxViews; }
    public void setMaxViews(Integer maxViews) { this.maxViews = maxViews; }

    public int getViewCount() { return viewCount; }
    public void setViewCount(int viewCount) { this.viewCount = viewCount; }

    public Instant getCreatedAt() { return createdAt; }
}

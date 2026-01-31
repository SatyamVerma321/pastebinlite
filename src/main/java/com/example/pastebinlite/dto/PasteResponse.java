package com.example.pastebinlite.dto;
/**
Author:verma
Date : 27 Jan 2026
time :9:36:55 pm
*/

import java.time.Instant;

public class PasteResponse {

    private String content;
    private Integer remaining_views;
    private Instant expires_at;

    public PasteResponse(String content, Integer remainingViews, Instant expiresAt) {
        this.content = content;
        this.remaining_views = remainingViews;
        this.expires_at = expiresAt;
    }

    public String getContent() { return content; }
    public Integer getRemaining_views() { return remaining_views; }
    public Instant getExpires_at() { return expires_at; }
}

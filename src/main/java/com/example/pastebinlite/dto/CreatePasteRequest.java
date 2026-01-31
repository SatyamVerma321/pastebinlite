package com.example.pastebinlite.dto;
/**
Author:verma
Date : 27 Jan 2026
time :9:34:16 pm
*/

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class CreatePasteRequest {

    @NotBlank
    private String content;

    @Positive
    private Integer ttl_seconds;

    @Positive
    private Integer max_views;

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Integer getTtl_seconds() { return ttl_seconds; }
    public void setTtl_seconds(Integer ttl_seconds) { this.ttl_seconds = ttl_seconds; }

    public Integer getMax_views() { return max_views; }
    public void setMax_views(Integer max_views) { this.max_views = max_views; }
}


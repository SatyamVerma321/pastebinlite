package com.example.pastebinlite.controller;
/**
Author:verma
Date : 27 Jan 2026
time :9:51:44 pm
*/

import com.example.pastebinlite.repository.PasteRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class HealthController {

    private final PasteRepository repository;

    public HealthController(PasteRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/api/healthz")
    public Map<String, Boolean> health() {
        repository.count(); // DB connectivity check
        return Map.of("ok", true);
    }
}

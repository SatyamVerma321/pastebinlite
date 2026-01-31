package com.example.pastebinlite.controller;
/**
Author:verma
Date : 27 Jan 2026
time :9:52:34 pm
*/

import com.example.pastebinlite.dto.CreatePasteRequest;
import com.example.pastebinlite.dto.PasteResponse;
import com.example.pastebinlite.entity.Paste;
import com.example.pastebinlite.service.PasteService;
import com.example.pastebinlite.util.TimeProvider;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")

@RestController
@RequestMapping("/api/pastes")
public class PasteApiController {

    private final PasteService service;
    private final TimeProvider timeProvider;

    public PasteApiController(PasteService service, TimeProvider timeProvider) {
        this.service = service;
        this.timeProvider = timeProvider;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, String> create(@Valid @RequestBody CreatePasteRequest request,
                                      HttpServletRequest httpRequest) {

        Paste paste = service.create(
                request.getContent(),
                request.getTtl_seconds(),
                request.getMax_views(),
                timeProvider.now(httpRequest)
        );

        String baseUrl = httpRequest.getScheme() + "://" + httpRequest.getServerName()
                + (httpRequest.getServerPort() == 80 || httpRequest.getServerPort() == 443 ? "" : ":" + httpRequest.getServerPort());

        return Map.of(
                "id", paste.getId(),
                "url", baseUrl + "/p/" + paste.getId()
        );
    }

    @GetMapping("/{id}")
    public PasteResponse fetch(@PathVariable String id, HttpServletRequest request) {
        Paste paste = service.fetchAndConsume(id, timeProvider.now(request));

        Integer remaining = paste.getMaxViews() == null
                ? null
                : paste.getMaxViews() - paste.getViewCount();

        return new PasteResponse(
                paste.getContent(),
                remaining,
                paste.getExpiresAt()
        );
    }

    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> notFound() {
        return Map.of("error", "Paste not found");
    }
}

package com.example.pastebinlite.service;
/**
Author:verma
Date : 27 Jan 2026
time :9:49:34 pm
*/

import com.example.pastebinlite.entity.Paste;
import com.example.pastebinlite.repository.PasteRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
public class PasteService {

    private final PasteRepository repository;

    public PasteService(PasteRepository repository) {
        this.repository = repository;
    }

    public Paste create(String content, Integer ttlSeconds, Integer maxViews, Instant now) {
        Paste paste = new Paste();
        paste.setId(UUID.randomUUID().toString().replace("-", ""));
        paste.setContent(content);
        paste.setMaxViews(maxViews);

        if (ttlSeconds != null) {
            paste.setExpiresAt(now.plusSeconds(ttlSeconds));
        }

        return repository.save(paste);
    }

    @Transactional
    public Paste fetchAndConsume(String id, Instant now) {
        Paste paste = repository.findById(id)
                .orElseThrow(EntityNotFoundException::new);

        if (paste.isExpired(now) || paste.isViewLimitExceeded()) {
            throw new EntityNotFoundException();
        }

        paste.setViewCount(paste.getViewCount() + 1);
        return paste;
    }

    public Paste findForView(String id, Instant now) {
        Paste paste = repository.findById(id)
                .orElseThrow(EntityNotFoundException::new);

        if (paste.isExpired(now) || paste.isViewLimitExceeded()) {
            throw new EntityNotFoundException();
        }
        return paste;
    }
}

package com.example.pastebinlite.controller;
/**
Author:verma
Date : 27 Jan 2026
time :9:54:18 pm
*/
import com.example.pastebinlite.entity.Paste;
import com.example.pastebinlite.service.PasteService;
import com.example.pastebinlite.util.TimeProvider;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class PasteViewController {

    private final PasteService service;
    private final TimeProvider timeProvider;

    public PasteViewController(PasteService service, TimeProvider timeProvider) {
        this.service = service;
        this.timeProvider = timeProvider;
    }

    @GetMapping("/")
    public String home() {
        return "create";
    }

    @PostMapping("/create")
    public String create(@RequestParam String content,
                         @RequestParam(required = false) Integer ttl,
                         @RequestParam(required = false) Integer maxViews,
                         HttpServletRequest request,
                         Model model) {

        Paste paste = service.create(content, ttl, maxViews, timeProvider.now(request));
        model.addAttribute("url", "/p/" + paste.getId());
        return "create";
    }

    @GetMapping("/p/{id}")
    public String view(@PathVariable String id, HttpServletRequest request, Model model) {
        try {
            Paste paste = service.fetchAndConsume(id, timeProvider.now(request));
            model.addAttribute("content", paste.getContent());
            return "view";
        } catch (EntityNotFoundException e) {
            return "error";
        }
    }
}

package com.example.pastebinlite.util;
/**
Author:verma
Date : 27 Jan 2026
time :9:46:18 pm
*/

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class TimeProvider {

    public Instant now(HttpServletRequest request) {
        String testMode = System.getenv("TEST_MODE");
        if ("1".equals(testMode)) {
            String header = request.getHeader("x-test-now-ms");
            if (header != null) {
                return Instant.ofEpochMilli(Long.parseLong(header));
            }
        }
        return Instant.now();
    }
}

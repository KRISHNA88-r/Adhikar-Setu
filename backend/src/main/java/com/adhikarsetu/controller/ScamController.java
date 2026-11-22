package com.adhikarsetu.controller;

import com.adhikarsetu.dto.ScamRequest;
import com.adhikarsetu.rules.ScamShield;
import com.adhikarsetu.util.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/scam")
public class ScamController {
    private final RateLimiter limiter;
    public ScamController(RateLimiter limiter) { this.limiter = limiter; }

    @PostMapping("/check")
    public ScamShield.Result check(@Valid @RequestBody ScamRequest request, HttpServletRequest http) {
        limiter.check(http, "scam", 60);
        return ScamShield.check(request.text());
    }
}

package com.adhikarsetu.controller;

import com.adhikarsetu.rules.Profile;
import com.adhikarsetu.service.EligibilityService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/eligibility")
public class EligibilityController {
    private final EligibilityService eligibility;
    public EligibilityController(EligibilityService eligibility) { this.eligibility = eligibility; }

    /** Deterministic result from the rules engine. Nothing is stored. */
    @PostMapping("/check")
    public Map<String, List<EligibilityService.Item>> check(@RequestBody Profile profile) {
        return Map.of("results", eligibility.check(profile));
    }
}

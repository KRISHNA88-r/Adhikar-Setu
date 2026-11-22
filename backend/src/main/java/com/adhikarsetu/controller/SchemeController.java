package com.adhikarsetu.controller;

import com.adhikarsetu.entity.Scheme;
import com.adhikarsetu.service.SchemeService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/schemes")
public class SchemeController {
    private final SchemeService schemes;
    public SchemeController(SchemeService schemes) { this.schemes = schemes; }
    @GetMapping public List<Scheme> list() { return schemes.listActive(); }
    @GetMapping("/{idOrSlug}") public Scheme get(@PathVariable String idOrSlug) { return schemes.get(idOrSlug); }
}

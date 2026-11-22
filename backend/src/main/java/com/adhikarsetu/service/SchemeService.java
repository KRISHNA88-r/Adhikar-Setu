package com.adhikarsetu.service;

import com.adhikarsetu.entity.Scheme;
import com.adhikarsetu.repository.SchemeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class SchemeService {
    private final SchemeRepository schemes;
    public SchemeService(SchemeRepository schemes) { this.schemes = schemes; }
    public List<Scheme> listActive() { return schemes.findByActiveTrueOrderByNameAsc(); }
    public Scheme get(String idOrSlug) {
        if (idOrSlug.chars().allMatch(Character::isDigit)) {
            return schemes.findById(Long.parseLong(idOrSlug)).filter(s -> Boolean.TRUE.equals(s.getActive()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Scheme not found"));
        }
        return schemes.findBySlug(idOrSlug).filter(s -> Boolean.TRUE.equals(s.getActive()))
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Scheme not found"));
    }
}

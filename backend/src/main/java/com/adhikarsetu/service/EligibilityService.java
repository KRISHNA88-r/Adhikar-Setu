package com.adhikarsetu.service;

import com.adhikarsetu.entity.Scheme;
import com.adhikarsetu.repository.SchemeRepository;
import com.adhikarsetu.rules.*;
import org.springframework.stereotype.Service;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

@Service
public class EligibilityService {
    public record Item(Scheme scheme, Status status, List<Reason> reasons) {}

    private final SchemeRepository schemes;
    public EligibilityService(SchemeRepository schemes) { this.schemes = schemes; }

    public List<Item> check(Profile raw) {
        Profile p = sanitize(raw);
        return schemes.findByActiveTrueOrderByNameAsc().stream()
            .map(s -> { Evaluation e = RuleEngine.evaluate(p, rulesOf(s)); return new Item(s, e.status(), e.reasons()); })
            .sorted(Comparator.comparing((Item i) -> i.status().ordinal()).thenComparing(i -> i.scheme().getName()))
            .toList();
    }

    static SchemeRules rulesOf(Scheme s) {
        List<String> occ = s.getOccupations() == null ? List.of()
            : Arrays.stream(s.getOccupations().split(",")).map(String::trim).filter(x -> !x.isEmpty()).toList();
        return new SchemeRules(s.getMinAge(), s.getMaxAge(), s.getMaxIncome(), occ, s.getGender(), s.getArea(),
            Boolean.TRUE.equals(s.getRequiresLand()), Boolean.TRUE.equals(s.getRequiresDisability()));
    }

    static Profile sanitize(Profile p) {
        Integer age = p.age() != null && p.age() >= 0 && p.age() <= 120 ? p.age() : null;
        Integer min = p.incomeMin() != null && p.incomeMin() >= 0 ? p.incomeMin() : null;
        Integer max = p.incomeMax() != null && p.incomeMax() >= 0 ? p.incomeMax() : null;
        return new Profile(age, up(p.gender()), up(p.area()), low(p.occupation()), p.ownsLand(), p.hasDisability(), min, max);
    }
    private static String up(String s) { return s == null || s.isBlank() ? null : s.trim().toUpperCase(); }
    private static String low(String s) { return s == null || s.isBlank() ? null : s.trim().toLowerCase(); }
}

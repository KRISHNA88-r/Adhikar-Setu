package com.adhikarsetu.repository;

import com.adhikarsetu.entity.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SchemeRepository extends JpaRepository<Scheme, Long> {
    List<Scheme> findByActiveTrueOrderByNameAsc();
    Optional<Scheme> findBySlug(String slug);
}

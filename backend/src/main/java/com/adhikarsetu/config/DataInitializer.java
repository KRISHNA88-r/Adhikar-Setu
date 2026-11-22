package com.adhikarsetu.config;

import com.adhikarsetu.entity.Scheme;
import com.adhikarsetu.repository.SchemeRepository;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import java.io.InputStream;

/**
 * Loads resources/data/schemes.json into PostgreSQL on every start. The JSON file is the source of truth:
 * records are matched by slug and updated, so editing the file and restarting refreshes the data.
 */
@Configuration
public class DataInitializer {
    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner seedSchemes(SchemeRepository repository) {
        return args -> {
            // remove the three old starter rows that had no slug
            repository.deleteAll(repository.findAll().stream().filter(s -> s.getSlug() == null).toList());
            ObjectMapper mapper = new ObjectMapper().findAndRegisterModules()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            try (InputStream in = new ClassPathResource("data/schemes.json").getInputStream()) {
                JsonNode array = mapper.readTree(in);
                int count = 0;
                for (JsonNode node : array) {
                    Scheme scheme = repository.findBySlug(node.get("slug").asText()).orElseGet(Scheme::new);
                    mapper.readerForUpdating(scheme).readValue(node);
                    scheme.setActive(true);
                    if (scheme.getVerified() == null) scheme.setVerified(false);
                    repository.save(scheme);
                    count++;
                }
                log.info("Loaded {} schemes from schemes.json", count);
            }
        };
    }
}

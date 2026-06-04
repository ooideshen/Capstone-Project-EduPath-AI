package com.edupath.ai.openrouter.config;

import com.edupath.ai.openrouter.entity.ApiUsage;
import com.edupath.ai.openrouter.repository.ApiUsageRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(ApiUsageRepository repository) {
        return args -> {
            if (!repository.existsById("TOTAL_USAGE")) {
                ApiUsage initialData = new ApiUsage("TOTAL_USAGE", 0L, LocalDateTime.now());
                repository.save(initialData);
                System.out.println("[Database] Initialization completed: TOTAL_USAGE record has been created.");
            }
        };
    }
}
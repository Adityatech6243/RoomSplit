package com.roommatesplit.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseStartupDiagnostic implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseStartupDiagnostic.class);
    private final MongoTemplate mongoTemplate;

    public DatabaseStartupDiagnostic(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public void run(String... args) {
        try {
            String dbName = mongoTemplate.getDb().getName();
            log.info("===============================================================================");
            log.info("[MONGODB DIAGNOSTIC] Connected Database Name : {}", dbName);
            long userCount = mongoTemplate.getCollection("users").countDocuments();
            log.info("[MONGODB DIAGNOSTIC] Current user count      : {}", userCount);
            log.info("===============================================================================");
        } catch (Exception e) {
            log.warn("[MONGODB DIAGNOSTIC] Database check warning: {}", e.getMessage());
        }
    }
}

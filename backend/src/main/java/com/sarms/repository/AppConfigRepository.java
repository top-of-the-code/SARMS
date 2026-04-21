package com.sarms.repository;

import com.sarms.model.AppConfig;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface AppConfigRepository extends MongoRepository<AppConfig, String> {
    Optional<AppConfig> findByKey(String key);
}

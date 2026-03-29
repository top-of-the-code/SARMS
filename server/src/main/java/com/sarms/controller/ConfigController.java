package com.sarms.controller;

import com.sarms.repository.AppConfigRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/config")
public class ConfigController {

    private final AppConfigRepository appConfigRepository;

    public ConfigController(AppConfigRepository appConfigRepository) {
        this.appConfigRepository = appConfigRepository;
    }

    @GetMapping("/{key}")
    public ResponseEntity<?> getByKey(@PathVariable String key) {
        return appConfigRepository.findByKey(key)
                .map(c -> ResponseEntity.ok((Object) c))
                .orElse(ResponseEntity.status(404).body(Map.of("error", "Config not found: " + key)));
    }
}

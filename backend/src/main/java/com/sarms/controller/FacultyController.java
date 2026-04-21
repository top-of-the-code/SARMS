package com.sarms.controller;

import com.sarms.model.Faculty;
import com.sarms.repository.FacultyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/faculty")
public class FacultyController {

    private final FacultyRepository facultyRepository;

    public FacultyController(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
    }

    @GetMapping
    public List<Faculty> getAll() {
        return facultyRepository.findAll();
    }

    @GetMapping("/{facultyId}")
    public ResponseEntity<?> getById(@PathVariable String facultyId) {
        return facultyRepository.findByFacultyId(facultyId)
                .map(f -> ResponseEntity.ok((Object) f))
                .orElse(ResponseEntity.status(404).body(Map.of("error", "Faculty not found")));
    }
}

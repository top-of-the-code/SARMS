package com.sarms.repository;

import com.sarms.model.Faculty;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface FacultyRepository extends MongoRepository<Faculty, String> {
    Optional<Faculty> findByFacultyId(String facultyId);
}

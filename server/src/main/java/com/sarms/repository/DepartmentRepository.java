package com.sarms.repository;

import com.sarms.model.Department;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface DepartmentRepository extends MongoRepository<Department, String> {
    Optional<Department> findByCode(String code);
}

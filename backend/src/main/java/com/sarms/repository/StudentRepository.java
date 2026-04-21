package com.sarms.repository;

import com.sarms.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByRollNo(String rollNo);
    List<Student> findByProgram(String program);
    List<Student> findByBatchYear(int batchYear);
    long countByRollNoStartingWith(String prefix);
    boolean existsByPersonalPhone(String personalPhone);
}

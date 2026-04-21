package com.sarms.repository;

import com.sarms.model.Enrollment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface EnrollmentRepository extends MongoRepository<Enrollment, String> {
    List<Enrollment> findByRollNo(String rollNo);
    List<Enrollment> findByCourseCode(String courseCode);
    List<Enrollment> findByRollNoAndConfirmed(String rollNo, boolean confirmed);
    long countByCourseCode(String courseCode);
    void deleteByRollNoAndCourseCode(String rollNo, String courseCode);
}

package com.sarms.repository;

import com.sarms.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface CourseRepository extends MongoRepository<Course, String> {
    Optional<Course> findByCode(String code);
    List<Course> findBySemester(int semester);
    List<Course> findByFacultyId(String facultyId);
    List<Course> findByCategory(String category);
    List<Course> findByActiveSemester(boolean activeSemester);
    boolean existsByCode(String code);
    List<Course> findBySemesterAndCategoryAndDepartmentCode(int semester, String category, String departmentCode);
}

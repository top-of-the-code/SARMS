package com.sarms.repository;

import com.sarms.model.Marks;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface MarksRepository extends MongoRepository<Marks, String> {
    Optional<Marks> findByCourseCode(String courseCode);
    List<Marks> findBySemester(int semester);
}

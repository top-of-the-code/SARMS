package com.sarms.repository;

import com.sarms.model.TimetableSlot;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TimetableSlotRepository extends MongoRepository<TimetableSlot, String> {
    List<TimetableSlot> findByCourseCode(String courseCode);
    List<TimetableSlot> findByCourseCodeIn(List<String> courseCodes);
}

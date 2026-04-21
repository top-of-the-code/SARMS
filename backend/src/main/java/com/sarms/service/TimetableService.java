package com.sarms.service;

import com.sarms.model.TimetableSlot;
import com.sarms.repository.TimetableSlotRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TimetableService {

    private final TimetableSlotRepository timetableSlotRepository;
    private final EnrollmentService enrollmentService;

    public TimetableService(TimetableSlotRepository timetableSlotRepository,
                            EnrollmentService enrollmentService) {
        this.timetableSlotRepository = timetableSlotRepository;
        this.enrollmentService = enrollmentService;
    }

    public List<TimetableSlot> getAll() {
        return timetableSlotRepository.findAll();
    }

    public List<TimetableSlot> getForStudent(String rollNo) {
        List<String> enrolledCodes = enrollmentService.getEnrolledCourseCodes(rollNo);
        if (enrolledCodes.isEmpty()) {
            return List.of();
        }
        return timetableSlotRepository.findByCourseCodeIn(enrolledCodes);
    }
}

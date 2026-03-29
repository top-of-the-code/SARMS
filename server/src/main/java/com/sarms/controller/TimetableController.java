package com.sarms.controller;

import com.sarms.model.TimetableSlot;
import com.sarms.service.TimetableService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timetable")
public class TimetableController {

    private final TimetableService timetableService;

    public TimetableController(TimetableService timetableService) {
        this.timetableService = timetableService;
    }

    @GetMapping
    public List<TimetableSlot> getAll() {
        return timetableService.getAll();
    }

    @GetMapping("/student/{rollNo}")
    public List<TimetableSlot> getForStudent(@PathVariable String rollNo) {
        return timetableService.getForStudent(rollNo);
    }
}

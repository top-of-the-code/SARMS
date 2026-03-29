package com.sarms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "timetable_slots")
public class TimetableSlot {
    @Id
    private String id;

    private String courseCode;
    private String courseName;
    private String type;           // "Lecture" | "Lab" | "Tutorial"
    private String room;
    private String facultyName;
    private List<Integer> days;    // [0, 2] = Mon, Wed
    private int startHour;         // 24h
    private int endHour;
    private String colorClass;     // Tailwind classes
}

package com.sarms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "students")
public class Student {
    @Id
    private String id;

    @Indexed(unique = true)
    private String rollNo;          // "STUD-2022-001"

    private String name;
    private String fatherName;
    private String motherName;
    private String guardianPhone;
    private String personalPhone;
    private String address;
    private LocalDate dob;
    private String program;         // "B.Tech Computer Science"
    private int batchYear;
    private String email;
    private String bloodGroup;

    private List<SemesterRecord> academicRecord = new ArrayList<>();

    // ── Embedded sub-documents ──

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SemesterRecord {
        private int semester;
        private double sgpa;
        private List<CourseGrade> courses = new ArrayList<>();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CourseGrade {
        private String courseCode;
        private String courseName;
        private double credits;
        private String grade;       // "A+", "A", "B+", etc.
        private int gradePoints;    // 10, 9, 8, ...
    }
}

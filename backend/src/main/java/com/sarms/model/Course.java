package com.sarms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "courses")
public class Course {
    @Id
    private String id;

    @Indexed(unique = true)
    private String code;             // "CSC401"

    private String name;
    private double credits;
    private int semester;
    private String semesterType;     // "Monsoon" | "Spring"
    private int year;

    private String facultyId;        // ref → users.userId
    private String facultyName;      // denormalized

    private String type;             // "Compulsory" | "Elective"
    private String category;         // "core" | "majorElective" | "uwe" | "ccc"
    private String department;
    private String departmentCode;

    private int enrolled;
    private String status;           // "Active" | "Inactive" | "Pending"
    private boolean activeSemester;

    private String description;
    private List<String> syllabusTopics = new ArrayList<>();
    private List<GradingComponent> gradedComponents = new ArrayList<>();
    private boolean resultsPublished;

    // ── Embedded sub-document ──

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GradingComponent {
        private String id;           // "comp1", "comp2", ...
        private String name;         // "Assignments", "Quiz", ...
        private int weight;          // percentage
    }
}

package com.sarms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "marks")
public class Marks {
    @Id
    private String id;

    @Indexed(unique = true)
    private String courseCode;

    private String courseName;
    private int semester;
    private boolean activeSemester;

    private List<Course.GradingComponent> gradingComponents = new ArrayList<>();
    private List<StudentMark> studentMarks = new ArrayList<>();

    // ── Embedded sub-document ──

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentMark {
        private String rollNo;
        private String name;
        private Map<String, Double> marks;  // { "comp1": 18.0, "comp2": 9.0, ... }
    }
}

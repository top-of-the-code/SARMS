package com.sarms.dto;

import lombok.Data;
import java.util.List;

@Data
public class GradeUpdateRequest {
    private int semester;
    private List<CourseGradeUpdate> courses;

    @Data
    public static class CourseGradeUpdate {
        private String courseCode;
        private String newGrade;
    }
}

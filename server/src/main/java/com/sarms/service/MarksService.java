package com.sarms.service;

import com.sarms.model.Course;
import com.sarms.model.Marks;
import com.sarms.repository.MarksRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class MarksService {

    private final MarksRepository marksRepository;

    // Grade mapping: percentage → letter + points
    private static final Map<String, Integer> GRADE_POINTS = Map.of(
            "A+", 10, "A", 9, "B+", 8, "B", 7, "C", 6, "D", 5, "F", 0
    );

    public MarksService(MarksRepository marksRepository) {
        this.marksRepository = marksRepository;
    }

    public Marks getByCourseCode(String courseCode) {
        return marksRepository.findByCourseCode(courseCode)
                .orElseThrow(() -> new RuntimeException("No marks data for course: " + courseCode));
    }

    public Marks updateStudentMarks(String courseCode, List<Marks.StudentMark> studentMarks) {
        Marks marks = getByCourseCode(courseCode);
        marks.setStudentMarks(studentMarks);
        return marksRepository.save(marks);
    }

    public Marks updateGradingComponents(String courseCode, List<Course.GradingComponent> components) {
        // Validate weights sum to 100
        int total = components.stream().mapToInt(Course.GradingComponent::getWeight).sum();
        if (total != 100) {
            throw new RuntimeException("Grading components must sum to 100%, got " + total + "%");
        }

        Marks marks = getByCourseCode(courseCode);
        marks.setGradingComponents(components);
        return marksRepository.save(marks);
    }

    // Utility: compute weighted total %
    public static double calcWeightedTotal(Map<String, Double> marks, List<Course.GradingComponent> components) {
        double total = 0;
        for (Course.GradingComponent comp : components) {
            java.util.regex.Matcher match = java.util.regex.Pattern.compile("Best (\\d+) of (\\d+)").matcher(comp.getName() == null ? "" : comp.getName());
            if (match.find()) {
                int n = Integer.parseInt(match.group(1));
                int m = Integer.parseInt(match.group(2));
                List<Double> scores = new ArrayList<>();
                for (int i = 0; i < m; i++) {
                    String subId = comp.getId() + "_" + i;
                    if (marks.containsKey(subId) && marks.get(subId) != null) {
                        scores.add(marks.get(subId));
                    }
                }
                scores.sort(java.util.Collections.reverseOrder());
                double compTotal = 0;
                for (int i = 0; i < Math.min(n, scores.size()); i++) {
                    compTotal += scores.get(i);
                }
                total += Math.min(compTotal, comp.getWeight());
            } else {
                Double scored = marks.getOrDefault(comp.getId(), 0.0);
                total += Math.min(scored, comp.getWeight());
            }
        }
        return Math.round(total * 10.0) / 10.0;
    }

    // Utility: percentage to grade letter
    public static String getGradeLetter(double totalPercent) {
        if (totalPercent >= 90) return "A+";
        if (totalPercent >= 80) return "A";
        if (totalPercent >= 70) return "B+";
        if (totalPercent >= 60) return "B";
        if (totalPercent >= 50) return "C";
        if (totalPercent >= 40) return "D";
        return "F";
    }

    public static int getGradePoints(String grade) {
        return GRADE_POINTS.getOrDefault(grade, 0);
    }

    /**
     * Add a single student to the marks roster for a course.
     * If no Marks document exists for the course yet, create one.
     */
    public void addStudentToRoster(String courseCode, String courseName, int semester,
                                   String rollNo, String studentName,
                                   List<Course.GradingComponent> gradingComponents) {
        Marks marks = marksRepository.findByCourseCode(courseCode).orElse(null);

        if (marks == null) {
            marks = new Marks();
            marks.setCourseCode(courseCode);
            marks.setCourseName(courseName);
            marks.setSemester(semester);
            marks.setActiveSemester(true);
            marks.setGradingComponents(gradingComponents != null ? gradingComponents : new ArrayList<>());
            marks.setStudentMarks(new ArrayList<>());
        }

        // Check if student already exists on the roster
        boolean alreadyPresent = marks.getStudentMarks().stream()
                .anyMatch(sm -> sm.getRollNo().equals(rollNo));

        if (!alreadyPresent) {
            Marks.StudentMark sm = new Marks.StudentMark();
            sm.setRollNo(rollNo);
            sm.setName(studentName);
            sm.setMarks(new java.util.HashMap<>());
            marks.getStudentMarks().add(sm);
        }

        marksRepository.save(marks);
    }

    public void removeStudentFromCourseRoster(String courseCode, String rollNo) {
        if (courseCode == null || rollNo == null) {
            return;
        }
        marksRepository.findByCourseCode(courseCode).ifPresent(marks -> {
            boolean removed = marks.getStudentMarks().removeIf(sm -> rollNo.equals(sm.getRollNo()));
            if (removed) {
                marksRepository.save(marks);
            }
        });
    }
}

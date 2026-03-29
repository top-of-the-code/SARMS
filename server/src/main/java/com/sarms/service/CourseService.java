package com.sarms.service;

import com.sarms.model.Course;
import com.sarms.model.Marks;
import com.sarms.model.Student;
import com.sarms.repository.CourseRepository;
import com.sarms.repository.MarksRepository;
import com.sarms.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final MarksRepository marksRepository;
    private final StudentRepository studentRepository;

    public CourseService(CourseRepository courseRepository,
                         MarksRepository marksRepository,
                         StudentRepository studentRepository) {
        this.courseRepository = courseRepository;
        this.marksRepository = marksRepository;
        this.studentRepository = studentRepository;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getByCode(String code) {
        return courseRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Course not found: " + code));
    }

    public List<Course> getBySemester(int semester) {
        return courseRepository.findBySemester(semester);
    }

    public List<Course> getByFacultyId(String facultyId) {
        return courseRepository.findByFacultyId(facultyId);
    }

    public Course createCourse(Course course) {
        if (courseRepository.existsByCode(course.getCode())) {
            throw new RuntimeException("Course code already exists: " + course.getCode());
        }
        course.setEnrolled(0);
        course.setResultsPublished(false);
        if (course.getStatus() == null) course.setStatus("Pending");
        return courseRepository.save(course);
    }

    public Course updateCourse(String code, Course updates) {
        Course course = getByCode(code);
        if (updates.getName() != null) course.setName(updates.getName());
        if (updates.getDescription() != null) course.setDescription(updates.getDescription());
        if (updates.getSyllabusTopics() != null) course.setSyllabusTopics(updates.getSyllabusTopics());
        if (updates.getGradedComponents() != null) course.setGradedComponents(updates.getGradedComponents());
        if (updates.getCredits() > 0) course.setCredits(updates.getCredits());
        if (updates.getFacultyId() != null) {
            course.setFacultyId(updates.getFacultyId());
            course.setFacultyName(updates.getFacultyName());
        }
        return courseRepository.save(course);
    }

    public Course toggleStatus(String code) {
        Course course = getByCode(code);
        course.setStatus("Active".equals(course.getStatus()) ? "Inactive" : "Active");
        return courseRepository.save(course);
    }

    public void publishResults(List<Integer> semesters) {
        List<Course> courses = courseRepository.findAll();
        for (Course c : courses) {
            if (semesters.contains(c.getSemester())) {
                c.setResultsPublished(true);
                c.setActiveSemester(false); // Lock the course
                courseRepository.save(c);

                // Fetch marks and update students
                Marks marks = marksRepository.findByCourseCode(c.getCode()).orElse(null);
                if (marks != null) {
                    marks.setActiveSemester(false); // Lock the marks
                    marksRepository.save(marks);

                    for (Marks.StudentMark sm : marks.getStudentMarks()) {
                        double totalPercent = MarksService.calcWeightedTotal(sm.getMarks(), marks.getGradingComponents());
                        String gradeLetter = MarksService.getGradeLetter(totalPercent);
                        int gradePoints = MarksService.getGradePoints(gradeLetter);

                        Student student = studentRepository.findByRollNo(sm.getRollNo()).orElse(null);
                        if (student != null) {
                            for (Student.SemesterRecord semRecord : student.getAcademicRecord()) {
                                if (semRecord.getSemester() == c.getSemester()) {
                                    // Update the specific course grade
                                    for (Student.CourseGrade cg : semRecord.getCourses()) {
                                        if (cg.getCourseCode().equals(c.getCode())) {
                                            cg.setGrade(gradeLetter);
                                            cg.setGradePoints(gradePoints);
                                        }
                                    }

                                    // Recompute SGPA for this semester
                                    double totalWeighted = 0, totalCredits = 0;
                                    for (Student.CourseGrade cg : semRecord.getCourses()) {
                                        if (!"IP".equals(cg.getGrade())) {
                                            totalCredits += cg.getCredits();
                                            totalWeighted += cg.getCredits() * cg.getGradePoints();
                                        }
                                    }
                                    semRecord.setSgpa(totalCredits > 0 ? Math.round((totalWeighted / totalCredits) * 100.0) / 100.0 : 0);
                                }
                            }
                            studentRepository.save(student);
                        }
                    }
                }
            }
        }
    }

    public void incrementEnrollment(String code) {
        Course course = getByCode(code);
        course.setEnrolled(course.getEnrolled() + 1);
        courseRepository.save(course);
    }
}

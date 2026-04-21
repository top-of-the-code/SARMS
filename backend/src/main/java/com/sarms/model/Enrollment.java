package com.sarms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "enrollments")
@CompoundIndex(name = "student_course_idx", def = "{'rollNo': 1, 'courseCode': 1}", unique = true)
public class Enrollment {
    @Id
    private String id;

    private String rollNo;
    private String courseCode;
    private int semester;
    private boolean confirmed;
    private Instant enrolledAt;
}

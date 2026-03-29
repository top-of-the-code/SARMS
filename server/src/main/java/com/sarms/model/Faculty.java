package com.sarms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "faculty")
public class Faculty {
    @Id
    private String id;

    @Indexed(unique = true)
    private String facultyId;       // "FAC-001"

    private String name;
    private String designation;
    private String department;
    private String email;
    private String phone;
    private String specialization;
    private int joinYear;
}

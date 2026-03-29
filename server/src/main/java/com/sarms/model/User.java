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
@Document(collection = "users")
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;       // "STUD-2022-001", "FAC-001", "ADM-001"

    private String passwordHash; // BCrypt hashed

    private String role;         // "student", "faculty", "admin"

    private String name;         // Display name
}

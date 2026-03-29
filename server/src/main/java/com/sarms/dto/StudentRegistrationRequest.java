package com.sarms.dto;

import lombok.Data;

@Data
public class StudentRegistrationRequest {
    private String fullName;
    private String fatherName;
    private String motherName;
    private String guardianPhone;
    private String personalPhone;
    private String address;
    private String dob;          // "2004-03-14" ISO format
    private String program;
    private int batchYear;
}

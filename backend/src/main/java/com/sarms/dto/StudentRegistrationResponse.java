package com.sarms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudentRegistrationResponse {
    private String rollNo;
    private String temporaryPassword;
    private String name;
}

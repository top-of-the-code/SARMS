package com.sarms.dto;

import lombok.Data;
import java.util.List;

@Data
public class EnrollmentRequest {
    private int semester;
    private List<String> courseCodes;
}

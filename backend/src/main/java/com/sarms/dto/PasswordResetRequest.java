package com.sarms.dto;

import lombok.Data;

@Data
public class PasswordResetRequest {
    private String userId;
    private String newPassword;
}

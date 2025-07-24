package com.grademanager.sgm.dto;

import lombok.Data;

@Data
public class LoginRequestDto {
    private String email;
    private String password;
}
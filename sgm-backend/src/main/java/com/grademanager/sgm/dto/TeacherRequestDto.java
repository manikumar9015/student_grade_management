package com.grademanager.sgm.dto;

import lombok.Data;

@Data
public class TeacherRequestDto {
    private String firstName;
    private String lastName;
    private String email;
    private String password; // <-- ADD THIS
    private Long branchId;
}
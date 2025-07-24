package com.grademanager.sgm.dto;

import lombok.Data;

@Data
public class StudentRequestDto {
    private String usn;
    private String firstName;
    private String lastName;
    private String email;
    private String password; // <-- ADD THIS
    private int year;
    private String section;
    private Long branchId;
}
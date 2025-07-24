package com.grademanager.sgm.dto;

import com.grademanager.sgm.model.Branch;
import lombok.Data;

@Data
public class TeacherResponseDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Branch branch;
}
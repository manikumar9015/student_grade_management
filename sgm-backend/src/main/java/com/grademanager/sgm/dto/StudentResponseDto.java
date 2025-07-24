package com.grademanager.sgm.dto;

import com.grademanager.sgm.model.Branch;
import lombok.Data;
import java.util.Set;

@Data
public class StudentResponseDto {
    private Long id;
    private String usn;
    private String firstName;
    private String lastName;
    private String email;
    private int year;
    private String section;
    private Branch branch; // For simplicity, we'll show the whole branch object
    private Set<CourseResponseDto> courses;
}
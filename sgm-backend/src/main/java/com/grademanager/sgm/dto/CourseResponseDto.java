package com.grademanager.sgm.dto;

import lombok.Data;

@Data
public class CourseResponseDto {
    private Long id;
    private String courseName;
    private String courseCode;
    private int credits;
}
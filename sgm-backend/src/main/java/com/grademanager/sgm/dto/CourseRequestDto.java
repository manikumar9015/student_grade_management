package com.grademanager.sgm.dto;

import lombok.Data;

@Data
public class CourseRequestDto {
    private String courseName;
    private String courseCode;
    private int credits;
}
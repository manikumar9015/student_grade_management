package com.grademanager.sgm.dto;

import lombok.Data;
// This DTO will also include all the fields from GradeRequestDto
// For simplicity, you can have it extend the request DTO or duplicate fields.
// Let's duplicate for clarity.
@Data
public class GradeResponseDto {
    private Long id;
    private Long studentId;
    private Long courseId;

    // Raw Marks
    private Double mse1;
    private Double mse2;
    private Double task1;
    private Double task2;
    private Double task3;
    private Double recordMarks;
    private Double conductionMarks;
    private Double mseLab;
    private Double seeScore;
    private Integer semester;

    // Calculated IA Fields
    private double iaTotal;
    private double reducedIaTotal;
}
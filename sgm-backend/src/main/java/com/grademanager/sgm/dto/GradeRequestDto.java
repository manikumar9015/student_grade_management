package com.grademanager.sgm.dto;

import lombok.Data;

@Data
public class GradeRequestDto {
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
}
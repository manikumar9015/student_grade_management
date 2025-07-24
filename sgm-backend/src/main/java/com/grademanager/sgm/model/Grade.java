package com.grademanager.sgm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "grades")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Theory Internals
    private Double mse1;
    private Double mse2;

    // Task Internals
    private Double task1;
    private Double task2;
    private Double task3;

    // Lab Internals
    private Double recordMarks;
    private Double conductionMarks;
    private Double mseLab;

    // Final Exam Score (can be added later)
    private Double seeScore;

    @Column(nullable = false) // <-- ADD THIS
    private Integer semester;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
}
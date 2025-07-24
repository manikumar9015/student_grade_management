package com.grademanager.sgm.controller;

import com.grademanager.sgm.dto.StudentResponseDto;
import com.grademanager.sgm.service.StudentService;
import org.slf4j.Logger; // Import the Logger
import org.slf4j.LoggerFactory; // Import the LoggerFactory
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class EnrollmentController {

    // 1. Create a logger instance for this specific class
    private static final Logger logger = LoggerFactory.getLogger(EnrollmentController.class);

    private final StudentService studentService;

    public EnrollmentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/students/{studentId}/courses/{courseId}")
    public StudentResponseDto enrollStudentInCourse(@PathVariable Long studentId, @PathVariable Long courseId) {
        // 2. Use the logger to print an informational message
        logger.info("Attempting to enroll student with ID: {} into course with ID: {}", studentId, courseId);

        return studentService.enrollStudentInCourse(studentId, courseId);
    }

    @DeleteMapping("/students/{studentId}/courses/{courseId}")
    public StudentResponseDto unenrollStudentFromCourse(@PathVariable Long studentId, @PathVariable Long courseId) {
        return studentService.unenrollStudentFromCourse(studentId, courseId);
    }
}
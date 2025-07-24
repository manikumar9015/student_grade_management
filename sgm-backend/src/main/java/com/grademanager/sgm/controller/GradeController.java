package com.grademanager.sgm.controller;

import com.grademanager.sgm.dto.GradeRequestDto;
import com.grademanager.sgm.dto.GradeResponseDto;
import com.grademanager.sgm.service.GradeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/grades")
@CrossOrigin(origins = "http://localhost:5173")
public class GradeController {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    // Endpoint to add or update all grades for a student in a course
    @PostMapping("/student/{studentId}/course/{courseId}/semester/{semester}")
    public ResponseEntity<GradeResponseDto> addOrUpdateGrades(@PathVariable Long studentId,
                                                              @PathVariable Long courseId,
                                                              @PathVariable Integer semester,
                                                              @RequestBody GradeRequestDto gradeDto) {
        return ResponseEntity.ok(gradeService.addOrUpdateGrades(studentId, courseId, semester, gradeDto));
    }

    // Endpoint to get all grades for a student in a course
    @GetMapping("/student/{studentId}/course/{courseId}/semester/{semester}")
    public ResponseEntity<GradeResponseDto> getGradesForStudent(@PathVariable Long studentId,
                                                                @PathVariable Long courseId,
                                                                @PathVariable Integer semester) {
        return ResponseEntity.ok(gradeService.getGradesForStudent(studentId, courseId, semester));
    }

    // This is the corrected method
    @GetMapping("/student/{studentId}/course/{courseId}/semester/{semester}/final")
    public ResponseEntity<GradeResponseDto> getFinalGrade(@PathVariable Long studentId,
                                                          @PathVariable Long courseId,
                                                          @PathVariable Integer semester) { // <-- semester is added here
        return ResponseEntity.ok(gradeService.getFinalGrade(studentId, courseId, semester)); // <-- and passed here
    }
}
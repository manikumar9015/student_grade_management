package com.grademanager.sgm.controller;

import com.grademanager.sgm.dto.AttendanceDto;
import com.grademanager.sgm.service.AttendanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping; // Add this import
import org.springframework.web.bind.annotation.PathVariable; // Add this import
import java.util.List; // Add this import
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:5173")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping
    public ResponseEntity<AttendanceDto> markAttendance(@RequestBody AttendanceDto attendanceDto) {
        return ResponseEntity.ok(attendanceService.markAttendance(attendanceDto));
    }

    @GetMapping("/student/{studentId}/course/{courseId}")
    public ResponseEntity<List<AttendanceDto>> getAttendanceForStudent(@PathVariable Long studentId,
                                                                       @PathVariable Long courseId) {
        return ResponseEntity.ok(attendanceService.getAttendanceForStudent(studentId, courseId));
    }
}
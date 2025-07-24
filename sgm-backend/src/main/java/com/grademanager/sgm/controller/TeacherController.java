package com.grademanager.sgm.controller;

import com.grademanager.sgm.dto.TeacherRequestDto;
import com.grademanager.sgm.dto.TeacherResponseDto;
import com.grademanager.sgm.service.TeacherService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin(origins = "http://localhost:5173")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @PostMapping
    public ResponseEntity<TeacherResponseDto> createTeacher(@RequestBody TeacherRequestDto teacherDto) {
        return new ResponseEntity<>(teacherService.createTeacher(teacherDto), HttpStatus.CREATED);
    }

    @GetMapping
    public List<TeacherResponseDto> getAllTeachers() {
        return teacherService.getAllTeachers();
    }

    @GetMapping("/{id}")
    public TeacherResponseDto getTeacherById(@PathVariable Long id) {
        return teacherService.getTeacherById(id);
    }

    @PutMapping("/{id}")
    public TeacherResponseDto updateTeacher(@PathVariable Long id, @RequestBody TeacherRequestDto teacherDto) {
        return teacherService.updateTeacher(id, teacherDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeacher(@PathVariable Long id) {
        teacherService.deleteTeacher(id);
        return ResponseEntity.noContent().build();
    }
}
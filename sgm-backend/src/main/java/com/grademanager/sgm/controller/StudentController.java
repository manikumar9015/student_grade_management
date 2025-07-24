package com.grademanager.sgm.controller;

import com.grademanager.sgm.dto.CourseResponseDto;
import com.grademanager.sgm.dto.StudentRequestDto;
import com.grademanager.sgm.dto.StudentResponseDto;
import com.grademanager.sgm.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    public ResponseEntity<StudentResponseDto> createStudent(@RequestBody StudentRequestDto studentDto) {
        return new ResponseEntity<>(studentService.createStudent(studentDto), HttpStatus.CREATED);
    }

    @GetMapping
    public List<StudentResponseDto> getAllStudents() {
        return studentService.getAllStudents();
    }

    @GetMapping("/{id}")
    public StudentResponseDto getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id);
    }

    @PutMapping("/{id}")
    public StudentResponseDto updateStudent(@PathVariable Long id, @RequestBody StudentRequestDto studentDto) {
        return studentService.updateStudent(id, studentDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{studentId}/courses")
    public Set<CourseResponseDto> getEnrolledCourses(@PathVariable Long studentId) {
        return studentService.getEnrolledCourses(studentId);
    }

    @GetMapping("/search")
    public List<StudentResponseDto> searchStudents(@RequestParam("query") String query) {
        return studentService.searchStudents(query);
    }
}
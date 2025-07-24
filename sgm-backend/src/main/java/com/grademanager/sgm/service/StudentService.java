package com.grademanager.sgm.service;

import com.grademanager.sgm.dto.CourseResponseDto;
import com.grademanager.sgm.dto.StudentRequestDto;
import com.grademanager.sgm.dto.StudentResponseDto;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Set;

public interface StudentService {

    StudentResponseDto createStudent(StudentRequestDto studentDto);
    StudentResponseDto getStudentById(Long studentId);
    List<StudentResponseDto> getAllStudents();
    StudentResponseDto updateStudent(Long studentId, StudentRequestDto studentDto);
    void deleteStudent(Long studentId);
    Set<CourseResponseDto> getEnrolledCourses(Long studentId);
    StudentResponseDto enrollStudentInCourse(Long studentId, Long courseId);
    StudentResponseDto unenrollStudentFromCourse(Long studentId, Long courseId);
    List<StudentResponseDto> searchStudents(String query);

}
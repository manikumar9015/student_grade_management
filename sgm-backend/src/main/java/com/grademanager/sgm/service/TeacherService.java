package com.grademanager.sgm.service;

import com.grademanager.sgm.dto.TeacherRequestDto;
import com.grademanager.sgm.dto.TeacherResponseDto; // You will need to create this DTO
import java.util.List;

public interface TeacherService {
    TeacherResponseDto createTeacher(TeacherRequestDto teacherDto);
    List<TeacherResponseDto> getAllTeachers();
    TeacherResponseDto getTeacherById(Long teacherId);
    TeacherResponseDto updateTeacher(Long teacherId, TeacherRequestDto teacherDto);
    void deleteTeacher(Long teacherId);
}
package com.grademanager.sgm.service;

import com.grademanager.sgm.dto.GradeRequestDto;
import com.grademanager.sgm.dto.GradeResponseDto;

public interface GradeService {
    GradeResponseDto addOrUpdateGrades(Long studentId, Long courseId, Integer semester, GradeRequestDto gradeDto);
    GradeResponseDto getGradesForStudent(Long studentId, Long courseId, Integer semester);
    GradeResponseDto getFinalGrade(Long studentId, Long courseId, Integer semester);
}
package com.grademanager.sgm.service;

import com.grademanager.sgm.dto.CourseRequestDto;
import com.grademanager.sgm.dto.CourseResponseDto;
import java.util.List;

public interface CourseService {
    CourseResponseDto createCourse(CourseRequestDto courseDto);
    CourseResponseDto getCourseById(Long courseId);
    List<CourseResponseDto> getAllCourses();
    CourseResponseDto updateCourse(Long courseId, CourseRequestDto courseDto);
    void deleteCourse(Long courseId);

}
package com.grademanager.sgm.service;

import com.grademanager.sgm.dto.CourseRequestDto;
import com.grademanager.sgm.dto.CourseResponseDto;
import com.grademanager.sgm.exception.ResourceNotFoundException;
import com.grademanager.sgm.model.Course;
import com.grademanager.sgm.repository.CourseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    public CourseServiceImpl(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    @Transactional
    public CourseResponseDto createCourse(CourseRequestDto courseDto) {
        Course course = new Course();
        course.setCourseName(courseDto.getCourseName());
        course.setCourseCode(courseDto.getCourseCode());
        course.setCredits(courseDto.getCredits());
        Course savedCourse = courseRepository.save(course);
        return convertToDto(savedCourse);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseResponseDto getCourseById(Long courseId) {
        Course course = courseRepository.findByIdWithDetails(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
        return convertToDto(course);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CourseResponseDto> getAllCourses() {
        return courseRepository.findAllWithDetails()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CourseResponseDto updateCourse(Long courseId, CourseRequestDto courseDto) {
        // Improvement: Use the more efficient findByIdWithDetails
        Course course = courseRepository.findByIdWithDetails(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        course.setCourseName(courseDto.getCourseName());
        course.setCourseCode(courseDto.getCourseCode());
        course.setCredits(courseDto.getCredits());
        Course updatedCourse = courseRepository.save(course);
        return convertToDto(updatedCourse);
    }

    @Override
    @Transactional
    public void deleteCourse(Long courseId) {
        Course course = courseRepository.findById(courseId) // findById is okay here as we don't need related data
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
        courseRepository.delete(course);
    }

    private CourseResponseDto convertToDto(Course course) {
        CourseResponseDto dto = new CourseResponseDto();
        dto.setId(course.getId());
        dto.setCourseName(course.getCourseName());
        dto.setCourseCode(course.getCourseCode());
        dto.setCredits(course.getCredits()); // <-- This is the bug fix
        return dto;
    }
}
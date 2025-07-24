package com.grademanager.sgm.service;

import com.grademanager.sgm.dto.AttendanceDto;
import com.grademanager.sgm.exception.ResourceNotFoundException;
import com.grademanager.sgm.model.Attendance;
import com.grademanager.sgm.model.Course;
import com.grademanager.sgm.model.Student;
import com.grademanager.sgm.repository.AttendanceRepository;
import com.grademanager.sgm.repository.CourseRepository;
import com.grademanager.sgm.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public AttendanceServiceImpl(AttendanceRepository attendanceRepository, StudentRepository studentRepository, CourseRepository courseRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    @Transactional
    public AttendanceDto markAttendance(AttendanceDto attendanceDto) {
        // Find or create the attendance record
        Attendance attendance = attendanceRepository
                .findByStudentIdAndCourseIdAndDate(attendanceDto.getStudentId(), attendanceDto.getCourseId(), attendanceDto.getDate())
                .orElseGet(() -> {
                    Student student = studentRepository.findById(attendanceDto.getStudentId()).orElseThrow(() -> new ResourceNotFoundException("Student not found"));
                    Course course = courseRepository.findById(attendanceDto.getCourseId()).orElseThrow(() -> new ResourceNotFoundException("Course not found"));
                    Attendance newAttendance = new Attendance();
                    newAttendance.setStudent(student);
                    newAttendance.setCourse(course);
                    newAttendance.setDate(attendanceDto.getDate());
                    return newAttendance;
                });

        // Set the status and save
        attendance.setStatus(attendanceDto.getStatus());
        attendanceRepository.save(attendance);
        return attendanceDto;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceDto> getAttendanceForStudent(Long studentId, Long courseId) {
        List<Attendance> records = attendanceRepository.findByStudentIdAndCourseId(studentId, courseId);

        // Convert the list of entities to a list of DTOs
        return records.stream()
                .map(this::convertToDto)
                .collect(java.util.stream.Collectors.toList());
    }

    // Helper method to convert an entity to a DTO
    private AttendanceDto convertToDto(Attendance attendance) {
        AttendanceDto dto = new AttendanceDto();
        dto.setStudentId(attendance.getStudent().getId());
        dto.setCourseId(attendance.getCourse().getId());
        dto.setDate(attendance.getDate());
        dto.setStatus(attendance.getStatus());
        return dto;
    }
}
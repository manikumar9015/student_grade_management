package com.grademanager.sgm.service;

import com.grademanager.sgm.dto.AttendanceDto;

public interface AttendanceService {
    AttendanceDto markAttendance(AttendanceDto attendanceDto);
    java.util.List<AttendanceDto> getAttendanceForStudent(Long studentId, Long courseId);
}
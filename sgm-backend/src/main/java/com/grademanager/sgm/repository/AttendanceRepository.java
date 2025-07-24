package com.grademanager.sgm.repository;

import com.grademanager.sgm.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByStudentIdAndCourseIdAndDate(Long studentId, Long courseId, LocalDate date);
    java.util.List<Attendance> findByStudentIdAndCourseId(Long studentId, Long courseId);
}
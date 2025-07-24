package com.grademanager.sgm.repository;

import com.grademanager.sgm.model.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Long> {
    Optional<Grade> findByStudentIdAndCourseIdAndSemester(Long studentId, Long courseId, Integer semester);
}
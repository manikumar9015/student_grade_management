package com.grademanager.sgm.repository;

import com.grademanager.sgm.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    // Note: We are not fetching c.students here to keep the query simple
    // as our DTO won't show the student list directly.
    @Query("SELECT DISTINCT c FROM Course c")
    List<Course> findAllWithDetails();

    @Query("SELECT c FROM Course c WHERE c.id = :id")
    Optional<Course> findByIdWithDetails(Long id);
}
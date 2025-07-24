package com.grademanager.sgm.repository;

import com.grademanager.sgm.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    @Query("SELECT DISTINCT s FROM Student s LEFT JOIN FETCH s.branch LEFT JOIN FETCH s.courses")
    List<Student> findAllWithDetails();

    // THIS METHOD IS MISSING FROM YOUR PREVIOUS CODE
    @Query("SELECT s FROM Student s LEFT JOIN FETCH s.branch LEFT JOIN FETCH s.courses WHERE s.id = :id")
    Optional<Student> findByIdWithDetails(Long id);

    @Query("SELECT s FROM Student s WHERE LOWER(s.usn) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.lastName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Student> searchStudents(String query);
}
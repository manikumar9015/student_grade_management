package com.grademanager.sgm.service;

import com.grademanager.sgm.dto.GradeRequestDto;
import com.grademanager.sgm.dto.GradeResponseDto;
import com.grademanager.sgm.exception.ResourceNotFoundException;
import com.grademanager.sgm.model.Course;
import com.grademanager.sgm.model.Grade;
import com.grademanager.sgm.model.Student;
import com.grademanager.sgm.repository.CourseRepository;
import com.grademanager.sgm.repository.GradeRepository;
import com.grademanager.sgm.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class GradeServiceImpl implements GradeService {

    private final GradeRepository gradeRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public GradeServiceImpl(GradeRepository gradeRepository, StudentRepository studentRepository, CourseRepository courseRepository) {
        this.gradeRepository = gradeRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    // Corrected method signature
    @Override
    @Transactional
    public GradeResponseDto addOrUpdateGrades(Long studentId, Long courseId, Integer semester, GradeRequestDto gradeDto) {
        // Use the corrected repository method call
        Grade grade = gradeRepository.findByStudentIdAndCourseIdAndSemester(studentId, courseId, semester)
                .orElseGet(() -> {
                    Student student = studentRepository.findById(studentId).orElseThrow(() -> new ResourceNotFoundException("Student not found"));
                    Course course = courseRepository.findById(courseId).orElseThrow(() -> new ResourceNotFoundException("Course not found"));
                    Grade newGrade = new Grade();
                    newGrade.setStudent(student);
                    newGrade.setCourse(course);
                    newGrade.setSemester(semester); // Set the semester on creation
                    return newGrade;
                });

        // Update all marks from the DTO
        grade.setMse1(gradeDto.getMse1());
        grade.setMse2(gradeDto.getMse2());
        grade.setTask1(gradeDto.getTask1());
        grade.setTask2(gradeDto.getTask2());
        grade.setTask3(gradeDto.getTask3());
        grade.setRecordMarks(gradeDto.getRecordMarks());
        grade.setConductionMarks(gradeDto.getConductionMarks());
        grade.setMseLab(gradeDto.getMseLab());
        grade.setSeeScore(gradeDto.getSeeScore());

        Grade savedGrade = gradeRepository.save(grade);
        return convertToDtoWithCalculations(savedGrade);
    }

    @Override
    @Transactional(readOnly = true)
    public GradeResponseDto getGradesForStudent(Long studentId, Long courseId, Integer semester) {
        Grade grade = gradeRepository.findByStudentIdAndCourseIdAndSemester(studentId, courseId, semester)
                .orElseThrow(() -> new ResourceNotFoundException("No grades found for this student/course/semester combination."));
        return convertToDtoWithCalculations(grade);
    }

    // Corrected method signature
    @Override
    @Transactional(readOnly = true)
    public GradeResponseDto getFinalGrade(Long studentId, Long courseId, Integer semester) {
        // Correctly pass the semester to the method call
        GradeResponseDto calculatedDto = getGradesForStudent(studentId, courseId, semester);

        double reducedIaTotal = calculatedDto.getReducedIaTotal();
        double seeScore = Optional.ofNullable(calculatedDto.getSeeScore()).orElse(0.0);

        double scaledSeeScore = seeScore / 2.0;
        double finalScore = reducedIaTotal + scaledSeeScore;

        System.out.println("Final Calculated Score for Semester " + semester + ": " + finalScore);

        return calculatedDto;
    }

    private GradeResponseDto convertToDtoWithCalculations(Grade grade) {
        GradeResponseDto dto = new GradeResponseDto();
        dto.setId(grade.getId());
        dto.setStudentId(grade.getStudent().getId());
        dto.setCourseId(grade.getCourse().getId());
        dto.setSemester(grade.getSemester());

        dto.setMse1(grade.getMse1());
        dto.setMse2(grade.getMse2());
        dto.setTask1(grade.getTask1());
        dto.setTask2(grade.getTask2());
        dto.setTask3(grade.getTask3());
        dto.setRecordMarks(grade.getRecordMarks());
        dto.setConductionMarks(grade.getConductionMarks());
        dto.setMseLab(grade.getMseLab());
        dto.setSeeScore(grade.getSeeScore());

        double mse1 = Optional.ofNullable(grade.getMse1()).orElse(0.0);
        double mse2 = Optional.ofNullable(grade.getMse2()).orElse(0.0);
        double task1 = Optional.ofNullable(grade.getTask1()).orElse(0.0);
        double task2 = Optional.ofNullable(grade.getTask2()).orElse(0.0);
        double task3 = Optional.ofNullable(grade.getTask3()).orElse(0.0);
        double record = Optional.ofNullable(grade.getRecordMarks()).orElse(0.0);
        double conduct = Optional.ofNullable(grade.getConductionMarks()).orElse(0.0);
        double mseLab = Optional.ofNullable(grade.getMseLab()).orElse(0.0);

        double theoryTotal = mse1 + mse2 + task1 + task2 + task3;
        double labTotal = record + conduct + mseLab;

        double scaledTheory = (theoryTotal / 50.0) * 30.0;
        double scaledLab = (labTotal / 50.0) * 20.0;

        double reducedTotal = scaledTheory + scaledLab;

        dto.setIaTotal(theoryTotal + labTotal);
        dto.setReducedIaTotal(Math.round(reducedTotal));

        return dto;
    }
}
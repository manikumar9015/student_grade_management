package com.grademanager.sgm.service;

import com.grademanager.sgm.dto.CourseResponseDto;
import com.grademanager.sgm.dto.StudentRequestDto;
import com.grademanager.sgm.dto.StudentResponseDto;
import com.grademanager.sgm.exception.ResourceNotFoundException;
import com.grademanager.sgm.model.*;
import com.grademanager.sgm.repository.BranchRepository;
import com.grademanager.sgm.repository.CourseRepository;
import com.grademanager.sgm.repository.StudentRepository;
import com.grademanager.sgm.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections; // Import for Collections
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final BranchRepository branchRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentServiceImpl(StudentRepository studentRepository, BranchRepository branchRepository, CourseRepository courseRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.branchRepository = branchRepository;
        this.courseRepository = courseRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public StudentResponseDto createStudent(StudentRequestDto studentDto) {
        Branch branch = branchRepository.findById(studentDto.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + studentDto.getBranchId()));

        User user = new User();
        user.setEmail(studentDto.getEmail());
        user.setPassword(passwordEncoder.encode(studentDto.getPassword()));
        user.setRole(Role.STUDENT);

        Student student = new Student();
        student.setFirstName(studentDto.getFirstName());
        student.setLastName(studentDto.getLastName());
        student.setEmail(studentDto.getEmail());
        student.setUsn(studentDto.getUsn());
        student.setYear(studentDto.getYear());
        student.setSection(studentDto.getSection());
        student.setBranch(branch);
        student.setUser(user);

        Student savedStudent = studentRepository.save(student);
        return convertStudentToDto(savedStudent);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponseDto getStudentById(Long studentId) {
        Student student = studentRepository.findByIdWithDetails(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        return convertStudentToDto(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDto> getAllStudents() {
        return studentRepository.findAllWithDetails()
                .stream()
                .map(this::convertStudentToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public StudentResponseDto updateStudent(Long studentId, StudentRequestDto studentDto) {
        Student student = studentRepository.findByIdWithDetails(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        Branch branch = branchRepository.findById(studentDto.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + studentDto.getBranchId()));

        User user = student.getUser();

        if (studentDto.getEmail() != null && !studentDto.getEmail().equals(user.getEmail())) {
            userRepository.findByEmailAndIdNot(studentDto.getEmail(), user.getId()).ifPresent(existingUser -> {
                throw new IllegalStateException("Email " + studentDto.getEmail() + " is already in use.");
            });
            user.setEmail(studentDto.getEmail());
            student.setEmail(studentDto.getEmail());
        }

        student.setFirstName(studentDto.getFirstName());
        student.setLastName(studentDto.getLastName());
        student.setUsn(studentDto.getUsn());
        student.setYear(studentDto.getYear());
        student.setSection(studentDto.getSection());
        student.setBranch(branch);

        Student updatedStudent = studentRepository.save(student);
        return convertStudentToDto(updatedStudent);
    }

    @Override
    @Transactional
    public void deleteStudent(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found with id: " + studentId);
        }
        studentRepository.deleteById(studentId);
    }

    @Override
    @Transactional
    public StudentResponseDto enrollStudentInCourse(Long studentId, Long courseId) {
        Student student = studentRepository.findByIdWithDetails(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        student.getCourses().add(course);
        Student savedStudent = studentRepository.save(student);

        return convertStudentToDto(savedStudent);
    }

    @Override
    @Transactional
    public StudentResponseDto unenrollStudentFromCourse(Long studentId, Long courseId) {
        Student student = studentRepository.findByIdWithDetails(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        student.getCourses().remove(course);
        Student updatedStudent = studentRepository.save(student);

        return convertStudentToDto(updatedStudent);
    }

    @Override
    @Transactional(readOnly = true)
    public Set<CourseResponseDto> getEnrolledCourses(Long studentId) {
        Student student = studentRepository.findByIdWithDetails(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        return student.getCourses().stream()
                .map(this::convertCourseToDto)
                .collect(Collectors.toSet());
    }

    // --- THIS IS THE TEMPORARY PLACEHOLDER METHOD ---
    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDto> searchStudents(String query) {
        // This version returns an empty list, as you requested.
        // The final version would call studentRepository.searchStudents(query);
        return Collections.emptyList();
    }

    private StudentResponseDto convertStudentToDto(Student student) {
        StudentResponseDto dto = new StudentResponseDto();
        dto.setId(student.getId());
        dto.setUsn(student.getUsn());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setEmail(student.getEmail());
        dto.setYear(student.getYear());
        dto.setSection(student.getSection());
        dto.setBranch(student.getBranch());

        Set<CourseResponseDto> courseDtos = student.getCourses().stream()
                .map(this::convertCourseToDto)
                .collect(Collectors.toSet());
        dto.setCourses(courseDtos);

        return dto;
    }

    private CourseResponseDto convertCourseToDto(Course course) {
        CourseResponseDto dto = new CourseResponseDto();
        dto.setId(course.getId());
        dto.setCourseName(course.getCourseName());
        dto.setCourseCode(course.getCourseCode());
        dto.setCredits(course.getCredits());
        return dto;
    }
}
package com.grademanager.sgm.service;

import com.grademanager.sgm.dto.TeacherRequestDto;
import com.grademanager.sgm.dto.TeacherResponseDto;
import com.grademanager.sgm.exception.ResourceNotFoundException;
import com.grademanager.sgm.model.Branch;
import com.grademanager.sgm.model.Role;
import com.grademanager.sgm.model.Teacher;
import com.grademanager.sgm.model.User;
import com.grademanager.sgm.repository.BranchRepository;
import com.grademanager.sgm.repository.TeacherRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;

    public TeacherServiceImpl(TeacherRepository teacherRepository, BranchRepository branchRepository, PasswordEncoder passwordEncoder) {
        this.teacherRepository = teacherRepository;
        this.branchRepository = branchRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public TeacherResponseDto createTeacher(TeacherRequestDto teacherDto) {
        Branch branch = branchRepository.findById(teacherDto.getBranchId())
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + teacherDto.getBranchId()));

        User user = new User();
        user.setEmail(teacherDto.getEmail());
        user.setPassword(passwordEncoder.encode(teacherDto.getPassword()));
        user.setRole(Role.TEACHER);

        Teacher teacher = new Teacher();
        teacher.setFirstName(teacherDto.getFirstName());
        teacher.setLastName(teacherDto.getLastName());
        teacher.setEmail(teacherDto.getEmail());
        teacher.setBranch(branch);
        teacher.setUser(user);

        Teacher savedTeacher = teacherRepository.save(teacher);
        return convertToDto(savedTeacher);
    }

    // Implement other service methods (getAll, getById, update, delete)
    // For brevity, I'm showing the full create logic and the DTO converter.
    // The rest will follow the same pattern as StudentServiceImpl.

    @Override
    public List<TeacherResponseDto> getAllTeachers() {
        return teacherRepository.findAll().stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public TeacherResponseDto getTeacherById(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId).orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
        return convertToDto(teacher);
    }

    @Override
    @Transactional
    public TeacherResponseDto updateTeacher(Long teacherId, TeacherRequestDto teacherDto) {
        Teacher teacher = teacherRepository.findById(teacherId).orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));
        Branch branch = branchRepository.findById(teacherDto.getBranchId()).orElseThrow(() -> new ResourceNotFoundException("Branch not found"));

        teacher.setFirstName(teacherDto.getFirstName());
        teacher.setLastName(teacherDto.getLastName());
        teacher.setEmail(teacherDto.getEmail());
        teacher.setBranch(branch);
        // Note: Does not update user email (username) or password here.

        Teacher updatedTeacher = teacherRepository.save(teacher);
        return convertToDto(updatedTeacher);
    }

    @Override
    @Transactional
    public void deleteTeacher(Long teacherId) {
        if (!teacherRepository.existsById(teacherId)) {
            throw new ResourceNotFoundException("Teacher not found with id: " + teacherId);
        }
        teacherRepository.deleteById(teacherId);
    }

    private TeacherResponseDto convertToDto(Teacher teacher) {
        TeacherResponseDto dto = new TeacherResponseDto();
        dto.setId(teacher.getId());
        dto.setFirstName(teacher.getFirstName());
        dto.setLastName(teacher.getLastName());
        dto.setEmail(teacher.getEmail());
        dto.setBranch(teacher.getBranch());
        return dto;
    }
}
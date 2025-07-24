package com.grademanager.sgm.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*; // Import EqualsAndHashCode and ToString

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "courses")
@Getter // Use individual annotations
@Setter // instead of @Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = "students") // Exclude relationship field
@ToString(exclude = "students") // Exclude from toString as well
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ... other fields are the same (courseName, courseCode) ...
    @Column(nullable = false)
    private String courseName;

    @Column(nullable = false, unique = true)
    private String courseCode;

    @Column(nullable = false)
    private int credits;

    @ManyToMany(mappedBy = "courses")
    @JsonBackReference
    private Set<Student> students = new HashSet<>();
}
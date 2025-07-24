package com.grademanager.sgm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor; // Make sure this import is present
import lombok.Data;
import lombok.NoArgsConstructor;   // Make sure this import is present

@Entity
@Table(name = "branches")
@Data
@NoArgsConstructor   // This annotation is ESSENTIAL for the fix
@AllArgsConstructor  // This annotation is also important
public class Branch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

}
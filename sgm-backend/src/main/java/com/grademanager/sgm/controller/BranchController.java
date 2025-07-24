package com.grademanager.sgm.controller;

import com.grademanager.sgm.model.Branch;
import com.grademanager.sgm.repository.BranchRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.grademanager.sgm.exception.ResourceNotFoundException;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/branches")
@CrossOrigin(origins = "http://localhost:5173")
public class BranchController {

    private final BranchRepository branchRepository;

    // Constructor Injection - The recommended way to inject dependencies
    public BranchController(BranchRepository branchRepository) {
        this.branchRepository = branchRepository;
    }

    // Endpoint to CREATE a new branch
    @PostMapping
    public Branch createBranch(@RequestBody Branch branch) {
        return branchRepository.save(branch);
    }

    // Endpoint to GET all branches
    @GetMapping
    public java.util.List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    // Endpoint to GET a single branch by its ID
    @GetMapping("/{id}")
    public Branch getBranchById(@PathVariable Long id) {
        return branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + id));
    }

    // Endpoint to UPDATE a branch
    @PutMapping("/{id}")
    public Branch updateBranch(@PathVariable Long id, @RequestBody Branch branchDetails) {
        // First, find the existing branch
        Branch existingBranch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + id));

        // Update the name with the new details from the request
        existingBranch.setName(branchDetails.getName());

        // Save the updated branch back to the database
        return branchRepository.save(existingBranch);
    }

    // Endpoint to DELETE a branch
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBranch(@PathVariable Long id) {
        // Find the branch first to make sure it exists
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Branch not found with id: " + id));

        branchRepository.delete(branch);

        return ResponseEntity.noContent().build();
    }
}
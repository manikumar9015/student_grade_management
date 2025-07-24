package com.grademanager.sgm.exception;

// No @ResponseStatus needed here anymore
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
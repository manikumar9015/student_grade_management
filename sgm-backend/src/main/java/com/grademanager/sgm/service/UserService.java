package com.grademanager.sgm.service;

import java.security.Principal;
import com.grademanager.sgm.dto.ChangePasswordRequest;

public interface UserService {
    void changePassword(ChangePasswordRequest request, Principal connectedUser);
}
package com.grademanager.sgm;

import com.grademanager.sgm.model.Role;
import com.grademanager.sgm.model.User;
import com.grademanager.sgm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Check if the admin user already exists
        if (userRepository.findByEmail("admin@sgm.com").isEmpty()) {
            User admin = new User();
            admin.setEmail("admin@sgm.com");
            admin.setPassword(passwordEncoder.encode("admin123")); // Set a default password
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println(">>>>>>>>>> Created default ADMIN user with password 'admin123' <<<<<<<<<<");
        }
    }
}
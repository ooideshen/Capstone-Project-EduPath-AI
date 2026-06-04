package com.edupath.ai.config;

import com.edupath.ai.users.entity.Users;
import com.edupath.ai.users.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * DataSeeder runs AFTER Hibernate creates/updates the schema and AFTER data.sql executes.
 * It patches the seed users' plain-text passwords with proper BCrypt hashes.
 * 
 * This is safe to run on every startup — it only hashes passwords that
 * are NOT already BCrypt-encoded (i.e., don't start with "$2a$").
 */
@Component
@Order(1)
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Hash any plain-text passwords left by data.sql
        for (Users user : usersRepository.findAll()) {
            if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                usersRepository.save(user);
                System.out.println("🔐 DataSeeder: Hashed password for user '" + user.getName() + "'");
            }
        }
    }
}

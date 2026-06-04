package com.edupath.ai.users.controller;

import com.edupath.ai.users.dto.UserRequest;
import com.edupath.ai.users.entity.Users;
import com.edupath.ai.users.service.UserService;
import com.edupath.ai.systemLog.service.SystemLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private SystemLogService systemLogService;

    @GetMapping("/all")
    public ResponseEntity<List<Users>> getAllUser() {
        List<Users> response = userService.getAllUsers();

        if (response != null && !response.isEmpty()) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Users> getUserById(@PathVariable Long id) {
        Users user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Users> updateUser(
            @PathVariable Long id,
            @RequestBody UserRequest request) {

        Users updatedUser = userService.update(id, request);

        if (updatedUser != null) {
            // After a user successfully updates, concatenate the log message and write it to the database asynchronously/synchronously.
            String logMessage = "User profile updated successfully for User ID: " + id + " (" + updatedUser.getName() + ").";

            // Call the logging service and save as INFO level logs.
            systemLogService.createLog("INFO", logMessage);

            return ResponseEntity.ok(updatedUser);
        } else {
            // If the update fails due to the user not being found, you can also log a warning/error message.
            systemLogService.createLog("ERROR", "Failed to update user. User ID: " + id + " not found.");

            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}

package com.edupath.ai.university.controller;

import com.edupath.ai.systemLog.service.SystemLogService;
import com.edupath.ai.university.dto.UniversityRequest;
import com.edupath.ai.university.entity.University;
import com.edupath.ai.university.service.UniversityService;
import com.edupath.ai.users.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/api/university")

public class UniversityController {
    @Autowired
    private UniversityService universityService;

    @Autowired
    private SystemLogService systemLogService;

    @PostMapping("/add")
    public ResponseEntity<University> addUniversity(@RequestBody UniversityRequest request) {
        University response = universityService.add(request);

        if (response != null) {
            String logMessage = "Successfully added new university: '" + response.getName() + "' (ID: " + response.getId() + ").";
            systemLogService.createLog("INFO", logMessage);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            systemLogService.createLog("WARN", "Failed to add university. Request payload was invalid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<University>> getAllUniversity() {
        List<University> response = universityService.getAllUniversities();

        if (response != null) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<University> updateUniversity(
            @PathVariable Long id,
            @RequestBody UniversityRequest request) {

        University updatedUniversity = universityService.update(id, request);

        if (updatedUniversity != null) {
            String logMessage = "Successfully updated university info for ID: " + id + " ('" + updatedUniversity.getName() + "').";
            systemLogService.createLog("INFO", logMessage);

            return ResponseEntity.ok(updatedUniversity);
        } else {
            systemLogService.createLog("WARN", "Failed to update university. University with ID " + id + " not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteUniversity(@PathVariable Long id) {
        boolean isDeleted = universityService.delete(id);

        if (isDeleted) {
            String logMessage = "Successfully deleted university with ID: " + id + ".";
            systemLogService.createLog("INFO", logMessage);

            return ResponseEntity.noContent().build();
        } else {
            systemLogService.createLog("WARN", "Failed to delete university. University with ID " + id + " not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}




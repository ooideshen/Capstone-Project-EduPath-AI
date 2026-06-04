package com.edupath.ai.career.controller;

import com.edupath.ai.career.dto.CareerRequest;
import com.edupath.ai.career.entity.Career;
import com.edupath.ai.career.service.CareerService;
import com.edupath.ai.systemLog.service.SystemLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/api/career")
public class CareerController {
    @Autowired
    private CareerService careerService;

    @Autowired
    private SystemLogService systemLogService;

    @PostMapping("/add")
    public ResponseEntity<Career> addCareer(@RequestBody CareerRequest request) {
        Career response = careerService.add(request);

        if (response != null) {
            String logMessage = "Successfully added new career: '" + response.getName() + "' (ID: " + response.getId() + ").";
            systemLogService.createLog("INFO", logMessage);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            systemLogService.createLog("WARN", "Failed to add new career.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Career>> getAllCareer() {
        List<Career> response = careerService.getAllCareers();

        if (response != null) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Career> updateCareer(
            @PathVariable Long id,
            @RequestBody CareerRequest request) {

        Career updatedCareer = careerService.update(id, request);

        if (updatedCareer != null) {
            String logMessage = "Successfully updated career data for ID: " + id + " ('" + updatedCareer.getName() + "').";
            systemLogService.createLog("INFO", logMessage);

            return ResponseEntity.ok(updatedCareer);
        } else {
            systemLogService.createLog("WARN", "Failed to update career. Career with ID " + id + " not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteCareer(@PathVariable Long id) {
        boolean isDeleted = careerService.delete(id);

        if (isDeleted) {
            String logMessage = "Successfully deleted career with ID: " + id + ".";
            systemLogService.createLog("INFO", logMessage);

            return ResponseEntity.noContent().build();
        } else {
            systemLogService.createLog("WARN", "Failed to delete career. Career with ID " + id + " not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}

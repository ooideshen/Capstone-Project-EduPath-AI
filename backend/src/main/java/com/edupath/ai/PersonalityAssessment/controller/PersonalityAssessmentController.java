package com.edupath.ai.PersonalityAssessment.controller;

import com.edupath.ai.PersonalityAssessment.dto.PersonalityAssessmentRequest;
import com.edupath.ai.PersonalityAssessment.entity.PersonalityAssessment;
import com.edupath.ai.PersonalityAssessment.service.PersonalityAssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController

@RequestMapping("/api/PersonalityAssessment")

public class PersonalityAssessmentController {
    @Autowired
    private PersonalityAssessmentService personalityAssessmentService;

    @PostMapping("/add")
    public ResponseEntity<PersonalityAssessment> addPersonalityAssessment(@RequestBody PersonalityAssessmentRequest request) {
        PersonalityAssessment response = personalityAssessmentService.add(request);

        if (response != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}








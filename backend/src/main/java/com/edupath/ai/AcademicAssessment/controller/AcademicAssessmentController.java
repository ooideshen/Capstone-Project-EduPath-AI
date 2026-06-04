package com.edupath.ai.AcademicAssessment.controller;

import com.edupath.ai.AcademicAssessment.dto.AcademicAssessmentRequest;
import com.edupath.ai.AcademicAssessment.entity.AcademicAssessment;
import com.edupath.ai.AcademicAssessment.service.AcademicAssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController

@RequestMapping("/api/AcademicAssessment")

public class AcademicAssessmentController {
    @Autowired
    private AcademicAssessmentService academicAssessmentService;

    @PostMapping("/add")
    public ResponseEntity<AcademicAssessment> addAcademicAssessment(@RequestBody AcademicAssessmentRequest request) {
        AcademicAssessment response = academicAssessmentService.add(request);

        if (response != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}






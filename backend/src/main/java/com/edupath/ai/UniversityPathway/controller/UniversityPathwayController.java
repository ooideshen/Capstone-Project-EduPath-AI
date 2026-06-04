package com.edupath.ai.UniversityPathway.controller;

import com.edupath.ai.UniversityPathway.dto.UniversityPathwayRequest;
import com.edupath.ai.UniversityPathway.entity.UniversityPathway;
import com.edupath.ai.UniversityPathway.service.UniversityPathwayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController

@RequestMapping("/api/UniversityPathway")

public class UniversityPathwayController {
    @Autowired
    private UniversityPathwayService universityPathwayService;

    @PostMapping("/add")
    public ResponseEntity<UniversityPathway> addUniversityPathway(@RequestBody UniversityPathwayRequest request) {
        UniversityPathway response = universityPathwayService.add(request);

        if (response != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}


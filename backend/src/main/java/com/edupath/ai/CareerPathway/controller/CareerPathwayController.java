package com.edupath.ai.CareerPathway.controller;

import com.edupath.ai.CareerPathway.dto.CareerPathwayRequest;
import com.edupath.ai.CareerPathway.entity.CareerPathway;
import com.edupath.ai.CareerPathway.service.CareerPathwayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/CareerPathway")

public class CareerPathwayController {
    @Autowired
    private CareerPathwayService careerPathwayService;

    @PostMapping("/add")
    public ResponseEntity<CareerPathway> addCareerPathway(@RequestBody CareerPathwayRequest request) {
        CareerPathway response = careerPathwayService.add(request);

        if (response != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}










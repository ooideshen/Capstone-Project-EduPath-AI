package com.edupath.ai.Pathway.controller;

import com.edupath.ai.Pathway.dto.PathwayRequest;
import com.edupath.ai.Pathway.entity.Pathway;
import com.edupath.ai.Pathway.service.PathwayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController

@RequestMapping("/api/Pathway")

public class PathwayController {
    @Autowired
    private PathwayService pathwayService;

    @PostMapping("/add")
    public ResponseEntity<Pathway> addPathway(@RequestBody PathwayRequest request) {
        Pathway response = pathwayService.add(request);

        if (response != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}







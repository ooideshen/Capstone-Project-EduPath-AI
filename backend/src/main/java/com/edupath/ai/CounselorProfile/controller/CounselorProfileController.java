package com.edupath.ai.CounselorProfile.controller;

import com.edupath.ai.CounselorProfile.dto.CounselorProfileRequest;
import com.edupath.ai.CounselorProfile.entity.CounselorProfile;
import com.edupath.ai.CounselorProfile.service.CounselorProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController

@RequestMapping("/api/CounselorProfile")

public class CounselorProfileController {
    @Autowired
    private CounselorProfileService counselorProfileService;

    @PostMapping("/add")
    public ResponseEntity<CounselorProfile> addCounselorProfile(@RequestBody CounselorProfileRequest request) {
        CounselorProfile response = counselorProfileService.add(request);

        if (response != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}







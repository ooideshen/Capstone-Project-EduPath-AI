package com.edupath.ai.AdminProfile.controller;

import com.edupath.ai.AdminProfile.dto.AdminProfileRequest;
import com.edupath.ai.AdminProfile.entity.AdminProfile;
import com.edupath.ai.AdminProfile.service.AdminProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/AdminProfile")

public class AdminProfileController {
    @Autowired
    private AdminProfileService adminProfileService;

    @PostMapping("/add")
    public ResponseEntity<AdminProfile> addAdminProfile(@RequestBody AdminProfileRequest request) {
        AdminProfile response = adminProfileService.add(request);

        if (response != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}





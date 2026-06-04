package com.edupath.ai.systemLog.controller;

import com.edupath.ai.systemLog.entity.SystemLog;
import com.edupath.ai.systemLog.service.SystemLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/system-log")

public class SystemLogController {
    @Autowired
    private SystemLogService systemLogService;

    @GetMapping("/all")
    public ResponseEntity<List<SystemLog>> getAllSystemLog() {
        List<SystemLog> response = systemLogService.getAllSystemLogs();

        if (response != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
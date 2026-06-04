package com.edupath.ai.courses.controller;

import com.edupath.ai.courses.dto.CourseRequest;
import com.edupath.ai.courses.entity.Courses;
import com.edupath.ai.courses.service.CourseService;
import com.edupath.ai.systemLog.service.SystemLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/api/course")
public class CourseController {
    @Autowired
    private CourseService courseService;

    @Autowired
    private SystemLogService systemLogService;

    @PostMapping("/add")
    public ResponseEntity<Courses> addCourse(@RequestBody CourseRequest request) {
        Courses response = courseService.add(request);

        if (response != null) {
            String logMessage = "Successfully added new course: '" + response.getCourseName() + "' (ID: " + response.getId() + ") into database.";
            systemLogService.createLog("INFO", logMessage);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            systemLogService.createLog("WARN", "Failed to add course. Request payload was invalid.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Courses>> getAllCourse() {
        List<Courses> response = courseService.getAllCourses();

        if (response != null) {
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}







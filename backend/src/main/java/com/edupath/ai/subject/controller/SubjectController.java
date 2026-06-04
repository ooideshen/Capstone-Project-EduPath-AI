package com.edupath.ai.subject.controller;

import com.edupath.ai.courses.dto.CourseUpdateRequest;
import com.edupath.ai.subject.entity.Subject;
import com.edupath.ai.subject.service.SubjectService;
import com.edupath.ai.systemLog.service.SystemLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

@RequestMapping("/api/subject")
public class SubjectController {
    @Autowired
    private SubjectService subjectService;

    @Autowired
    private SystemLogService systemLogService;

    @PutMapping("/update/{courseId}")
    public ResponseEntity<List<Subject>> updateFullCourse(
            @PathVariable Long courseId,
            @RequestBody CourseUpdateRequest request) {

        try {
            List<Subject> updatedSubjects = subjectService.updateFullCourseInfo(courseId, request);
            String logMessage = "Admin successfully updated full MQA course info & required subjects for Course ID: " + courseId + ".";
            systemLogService.createLog("INFO", logMessage);

            return ResponseEntity.ok(updatedSubjects);
        } catch (Exception e) {
            String errorMessage = "Critical error while updating course rules for Course ID " + courseId + ": " + e.getMessage();
            systemLogService.createLog("ERROR", errorMessage);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/delete/{courseId}")
    public ResponseEntity<String> deleteCourse(@PathVariable Long courseId) {
        try {
            subjectService.deleteCourseAndSubjects(courseId);
            String logMessage = "Admin successfully deleted Course and all its associated MQA subjects for Course ID: " + courseId + ".";
            systemLogService.createLog("INFO", logMessage);
            return ResponseEntity.ok("Course and its MQA requirements deleted successfully");
        } catch (Exception e) {
            String errorMessage = "Failed to delete Course rules for Course ID " + courseId + ". Error: " + e.getMessage();
            systemLogService.createLog("ERROR", errorMessage);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Delete failed: " + e.getMessage());
        }
    }
}








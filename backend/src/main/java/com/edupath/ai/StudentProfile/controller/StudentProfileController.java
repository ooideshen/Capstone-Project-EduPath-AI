package com.edupath.ai.StudentProfile.controller;

import com.edupath.ai.StudentProfile.repository.StudentProfileRepository;
import com.edupath.ai.StudentProfile.entity.StudentProfile;
import com.edupath.ai.users.repository.UsersRepository;
import com.edupath.ai.users.entity.Users;
import com.edupath.ai.AcademicAssessment.repository.AcademicAssessmentRepository;
import com.edupath.ai.AcademicAssessment.entity.AcademicAssessment;
import com.edupath.ai.PersonalityAssessment.repository.PersonalityAssessmentRepository;
import com.edupath.ai.PersonalityAssessment.entity.PersonalityAssessment;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Optional;


@RestController
@RequestMapping("/api/StudentProfile")
public class StudentProfileController {

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private UsersRepository usersRepository;
    
    @Autowired
    private AcademicAssessmentRepository academicAssessmentRepository;

    @Autowired
    private PersonalityAssessmentRepository personalityAssessmentRepository;

    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentProfileById(@PathVariable Long id) {
        return studentProfileRepository.findById(id)
                .map(profile -> ResponseEntity.ok(profile))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getStudentProfileByUserId(@PathVariable Long userId) {
        Optional<Users> userOpt = usersRepository.findById(userId);
        if (!userOpt.isPresent()) return ResponseEntity.notFound().build();
        
        Users user = userOpt.get();
        StudentProfile profile = user.getStudentProfile();
        
        if (profile != null) {
            return ResponseEntity.ok(profile);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/academic/{userId}/{assessmentId}")
    public ResponseEntity<?> linkAcademicAssessment(@PathVariable Long userId, @PathVariable Long assessmentId) {
        Optional<Users> userOpt = usersRepository.findById(userId);
        if (!userOpt.isPresent()) return ResponseEntity.notFound().build();
        
        Users user = userOpt.get();
        StudentProfile profile = user.getStudentProfile();
        
        if (profile == null) {
            profile = new StudentProfile();
            profile.setGender("Not Specified");
            profile.setDescription("");
            user.setStudentProfile(profile);
            studentProfileRepository.save(profile);
            usersRepository.save(user);
        }
        
        Optional<AcademicAssessment> assessmentOpt = academicAssessmentRepository.findById(assessmentId);
        if (!assessmentOpt.isPresent()) return ResponseEntity.notFound().build();
        
        profile.setAcademicAssessment(assessmentOpt.get());
        studentProfileRepository.save(profile);
        
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/personality/{userId}/{assessmentId}")
    public ResponseEntity<?> linkPersonalityAssessment(@PathVariable Long userId, @PathVariable Long assessmentId) {
        Optional<Users> userOpt = usersRepository.findById(userId);
        if (!userOpt.isPresent()) return ResponseEntity.notFound().build();
        
        Users user = userOpt.get();
        StudentProfile profile = user.getStudentProfile();
        
        if (profile == null) {
            profile = new StudentProfile();
            profile.setGender("Not Specified");
            profile.setDescription("");
            user.setStudentProfile(profile);
            studentProfileRepository.save(profile);
            usersRepository.save(user);
        }
        
        Optional<PersonalityAssessment> assessmentOpt = personalityAssessmentRepository.findById(assessmentId);
        if (!assessmentOpt.isPresent()) return ResponseEntity.notFound().build();
        
        profile.setPersonalityAssessment(assessmentOpt.get());
        studentProfileRepository.save(profile);
        
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/toggle-pathway/{userId}")
    public ResponseEntity<?> toggleSavedPathway(@PathVariable Long userId, @RequestBody java.util.Map<String, Object> pathwayData) {
        Optional<Users> userOpt = usersRepository.findById(userId);
        if (!userOpt.isPresent()) return ResponseEntity.notFound().build();
        
        Users user = userOpt.get();
        StudentProfile profile = user.getStudentProfile();
        
        if (profile == null) {
            return ResponseEntity.badRequest().body("Student profile not found.");
        }

        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            java.util.List<java.util.Map<String, Object>> savedList = new java.util.ArrayList<>();
            
            if (profile.getSavedPathways() != null && !profile.getSavedPathways().isEmpty()) {
                savedList = mapper.readValue(profile.getSavedPathways(), new com.fasterxml.jackson.core.type.TypeReference<java.util.List<java.util.Map<String, Object>>>() {});
            }

            String courseName = (String) pathwayData.get("course_name");
            boolean exists = false;
            java.util.Iterator<java.util.Map<String, Object>> iterator = savedList.iterator();
            
            while (iterator.hasNext()) {
                java.util.Map<String, Object> existing = iterator.next();
                if (courseName.equals(existing.get("course_name"))) {
                    iterator.remove(); // Toggle off (remove)
                    exists = true;
                    break;
                }
            }

            if (!exists) {
                savedList.add(pathwayData); // Toggle on (add)
            }

            profile.setSavedPathways(mapper.writeValueAsString(savedList));
            studentProfileRepository.save(profile);
            
            return ResponseEntity.ok(profile);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error toggling saved pathway.");
        }
    }
}

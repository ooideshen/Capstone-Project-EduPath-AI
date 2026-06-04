package com.edupath.ai.StudentProfile.service;

import com.edupath.ai.StudentProfile.dto.StudentProfileRequest;
import com.edupath.ai.StudentProfile.entity.StudentProfile;
import com.edupath.ai.StudentProfile.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class StudentProfileService {

    private final StudentProfileRepository studentProfileRepository;

    public StudentProfileService(StudentProfileRepository studentProfileRepository) {
        this.studentProfileRepository = studentProfileRepository;
    }

    public StudentProfile updateStudentProfile(Long id, StudentProfileRequest request) {
        StudentProfile profile = studentProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student Profile not found"));

        profile.setGender(request.getGender());
        profile.setDescription(request.getDescription());

        return studentProfileRepository.save(profile);
    }

    public StudentProfile getStudentProfile(Long id) {
        return studentProfileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student Profile not found"));
    }
}
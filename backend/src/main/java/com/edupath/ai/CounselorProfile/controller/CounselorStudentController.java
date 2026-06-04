package com.edupath.ai.CounselorProfile.controller;

import com.edupath.ai.CounselorProfile.dto.CounselorStudentResponse;
import com.edupath.ai.users.repository.UsersRepository;
import com.edupath.ai.users.entity.Users;
import com.edupath.ai.StudentProfile.entity.StudentProfile;
import com.edupath.ai.PersonalityAssessment.entity.PersonalityAssessment;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/counselor/student-list")

public class CounselorStudentController {

    private final UsersRepository usersRepository;

    public CounselorStudentController(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }


    @GetMapping
    public List<CounselorStudentResponse> getAllStudents() {
        return usersRepository.findByRole("STUDENT").stream().map(user -> {
            CounselorStudentResponse dto = new CounselorStudentResponse();
            dto.setStudent_id(user.getId());
            dto.setName(user.getName());
            dto.setEmail(user.getEmail());
            
            StudentProfile profile = user.getStudentProfile();
            if (profile != null) {
                dto.setGender(profile.getGender());
                dto.setAi_reality_report(profile.getAiRealityReport());
                
                PersonalityAssessment pa = profile.getPersonalityAssessment();
                if (pa != null) {
                    dto.setRealistic_mark(pa.getRealisticMark());
                    dto.setInvestigate_mark(pa.getInvestigateMark());
                    dto.setArtistic_mark(pa.getArtisticMark());
                    dto.setSocial_mark(pa.getSocialMark());
                    dto.setEnterprising_mark(pa.getEnterprisingMark());
                    dto.setConventional_mark(pa.getConventionalMark());
                }
            }
            return dto;
        }).collect(Collectors.toList());
    }
}

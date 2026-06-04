package com.edupath.ai.PersonalityAssessment.service;

import java.util.List;

import com.edupath.ai.PersonalityAssessment.dto.PersonalityAssessmentRequest;
import com.edupath.ai.PersonalityAssessment.entity.PersonalityAssessment;
import com.edupath.ai.PersonalityAssessment.repository.PersonalityAssessmentRepository;
import com.edupath.ai.StudentProfile.entity.StudentProfile;
import com.edupath.ai.StudentProfile.repository.StudentProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonalityAssessmentService {
    @Autowired
    private PersonalityAssessmentRepository personalityAssessmentRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    public PersonalityAssessment add(PersonalityAssessmentRequest request) {
        PersonalityAssessment personalityAssessment = new PersonalityAssessment();
        
        List<Integer> answers = request.getAnswers();
        if (answers == null || answers.size() < 15) {
            throw new IllegalArgumentException("15 answers are required for the RIASEC assessment.");
        }
        
        // Define the mapping for the 15 questions to their respective RIASEC trait
        // R = 0, I = 1, A = 2, S = 3, E = 4, C = 5
        // We ensure a balanced mix of questions.
        // Q1: I, Q2: A, Q3: S, Q4: E, Q5: C, Q6: R, Q7: I, Q8: E, Q9: S, Q10: C,
        // Q11: R, Q12: A, Q13: I, Q14: S, Q15: E
        int[] traitMapping = {1, 2, 3, 4, 5, 0, 1, 4, 3, 5, 0, 2, 1, 3, 4};
        
        int[] scores = new int[6];
        
        for (int i = 0; i < 15; i++) {
            int answer = answers.get(i); // Expecting 1, 2, or 3
            int traitIndex = traitMapping[i];
            scores[traitIndex] += answer;
        }

        personalityAssessment.setRealisticMark(scores[0]);
        personalityAssessment.setInvestigateMark(scores[1]);
        personalityAssessment.setArtisticMark(scores[2]);
        personalityAssessment.setSocialMark(scores[3]);
        personalityAssessment.setEnterprisingMark(scores[4]);
        personalityAssessment.setConventionalMark(scores[5]);
        
        personalityAssessment = personalityAssessmentRepository.save(personalityAssessment);

        return personalityAssessment;
    }
}










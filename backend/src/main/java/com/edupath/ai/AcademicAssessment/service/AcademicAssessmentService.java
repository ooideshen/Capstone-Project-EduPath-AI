package com.edupath.ai.AcademicAssessment.service;

import com.edupath.ai.AcademicAssessment.dto.AcademicAssessmentRequest;
import com.edupath.ai.AcademicAssessment.entity.AcademicAssessment;
import com.edupath.ai.AcademicAssessment.repository.AcademicAssessmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AcademicAssessmentService {

    @Autowired
    private AcademicAssessmentRepository academicAssessmentRepository;

    private String getGrade(String grade) {
        return (grade != null && !grade.isEmpty()) ? grade : "N/A";
    }

    public AcademicAssessment add(AcademicAssessmentRequest request) {
        AcademicAssessment academicAssessment = new AcademicAssessment();
        academicAssessment.setMalayGrade(getGrade(request.getMalayGrade()));
        academicAssessment.setEnglishGrade(getGrade(request.getEnglishGrade()));
        academicAssessment.setMoralGrade(getGrade(request.getMoralGrade()));
        academicAssessment.setHistoryGrade(getGrade(request.getHistoryGrade()));
        academicAssessment.setMathematicGrade(getGrade(request.getMathematicGrade()));
        academicAssessment.setScienceGrade(getGrade(request.getScienceGrade()));
        academicAssessment.setAddMathGrade(getGrade(request.getAddMathGrade()));
        academicAssessment.setPhysicGrade(getGrade(request.getPhysicGrade()));
        academicAssessment.setChemistryGrade(getGrade(request.getChemistryGrade()));
        academicAssessment.setBiologyGrade(getGrade(request.getBiologyGrade()));
        academicAssessment.setChineseGrade(getGrade(request.getChineseGrade()));
        academicAssessment.setBusinessGrade(getGrade(request.getBusinessGrade()));
        academicAssessment.setAccountingGrade(getGrade(request.getAccountingGrade()));
        academicAssessment.setEconomicGrade(getGrade(request.getEconomicGrade()));
        academicAssessment.setArtGrade(getGrade(request.getArtGrade()));
        academicAssessment.setComputerGrade(getGrade(request.getComputerGrade()));
        academicAssessment.setTrack((request.getTrack() != null && !request.getTrack().isEmpty()) ? request.getTrack() : "SPM");

        academicAssessment = academicAssessmentRepository.save(academicAssessment);

        return academicAssessment;
    }
}









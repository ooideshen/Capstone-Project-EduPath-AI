package com.edupath.ai.UniversityPathway.service;

import com.edupath.ai.UniversityPathway.dto.UniversityPathwayRequest;
import com.edupath.ai.UniversityPathway.entity.UniversityPathway;
import com.edupath.ai.UniversityPathway.repository.UniversityPathwayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UniversityPathwayService {
    @Autowired
    private UniversityPathwayRepository universityPathwayRepository;

    public UniversityPathway add(UniversityPathwayRequest request) {
        UniversityPathway universityPathway = new UniversityPathway();
        universityPathway.setCreatedDate(request.getCreatedDate());
        universityPathway = universityPathwayRepository.save(universityPathway);

        return universityPathway;
    }
}









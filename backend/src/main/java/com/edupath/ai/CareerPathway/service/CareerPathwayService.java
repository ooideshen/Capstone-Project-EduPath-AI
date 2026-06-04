package com.edupath.ai.CareerPathway.service;

import com.edupath.ai.CareerPathway.dto.CareerPathwayRequest;
import com.edupath.ai.CareerPathway.entity.CareerPathway;
import com.edupath.ai.CareerPathway.repository.CareerPathwayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CareerPathwayService {
    @Autowired
    private CareerPathwayRepository careerPathwayRepository;

    public CareerPathway add(CareerPathwayRequest request) {
        CareerPathway careerPathway = new CareerPathway();
        careerPathway.setCreatedDate(request.getCreatedDate());
        careerPathway = careerPathwayRepository.save(careerPathway);

        return careerPathway;
    }
}










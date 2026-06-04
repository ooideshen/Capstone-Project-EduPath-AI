package com.edupath.ai.career.service;

import com.edupath.ai.career.dto.CareerRequest;
import com.edupath.ai.career.entity.Career;
import com.edupath.ai.career.repository.CareerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CareerService {
    @Autowired
    private CareerRepository careerRepository;

    public Career add(CareerRequest request) {
        Career career = new Career();
        career.setName(request.getName());
        career.setSalary(request.getSalary());
        career.setRisk(request.getRisk());
        career = careerRepository.save(career);

        return career;
    }

    public List<Career> getAllCareers() {
        return careerRepository.findAllByOrderByIdDesc();
    }

    public Career update(Long id, CareerRequest request) {
        return careerRepository.findById(id).map(career -> {
            career.setName(request.getName());
            career.setSalary(request.getSalary());
            career.setRisk(request.getRisk());
            return careerRepository.save(career);
        }).orElse(null);
    }

    public boolean delete(Long id) {
        if (careerRepository.existsById(id)) {
            careerRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

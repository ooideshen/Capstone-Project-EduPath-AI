package com.edupath.ai.university.service;

import com.edupath.ai.university.dto.UniversityRequest;
import com.edupath.ai.university.entity.University;
import com.edupath.ai.university.repository.UniversityRepository;
import com.edupath.ai.users.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UniversityService {

    @Autowired
    private UniversityRepository universityRepository;

    public University add(UniversityRequest request) {
        University university = new University();
        university.setName(request.getName());
        university.setAddress(request.getAddress());
        university = universityRepository.save(university);

        return university;
    }

    public List<University> getAllUniversities() {
        return universityRepository.findAllByOrderByIdDesc();
    }

    public University update(Long id, UniversityRequest request) {
        return universityRepository.findById(id).map(university -> {
            university.setName(request.getName());
            university.setAddress(request.getAddress());
            return universityRepository.save(university);
        }).orElse(null);
    }

    public boolean delete(Long id) {
        if (universityRepository.existsById(id)) {
            universityRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

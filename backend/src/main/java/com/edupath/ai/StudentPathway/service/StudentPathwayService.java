package com.edupath.ai.StudentPathway.service;

import com.edupath.ai.StudentPathway.dto.StudentPathwayRequest;
import com.edupath.ai.StudentPathway.entity.StudentPathway;
import com.edupath.ai.StudentPathway.repository.StudentPathwayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentPathwayService {
    @Autowired
    private StudentPathwayRepository studentPathwayRepository;

    public StudentPathway add(StudentPathwayRequest request) {
        StudentPathway studentPathway = new StudentPathway();
        studentPathway.setCreatedDate(request.getCreatedDate());
        studentPathway = studentPathwayRepository.save(studentPathway);

        return studentPathway;
    }
}








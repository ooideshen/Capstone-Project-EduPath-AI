package com.edupath.ai.Pathway.service;

import com.edupath.ai.Pathway.dto.PathwayRequest;
import com.edupath.ai.Pathway.entity.Pathway;
import com.edupath.ai.Pathway.repository.PathwayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PathwayService {
    @Autowired
    private PathwayRepository pathwayRepository;

    public Pathway add(PathwayRequest request) {
        Pathway pathway = new Pathway();
        pathway.setPathwayName(request.getPathwayName());
        pathway = pathwayRepository.save(pathway);

        return pathway;
    }
}





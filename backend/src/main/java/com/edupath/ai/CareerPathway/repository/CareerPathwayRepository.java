package com.edupath.ai.CareerPathway.repository;

import com.edupath.ai.CareerPathway.entity.CareerPathway;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CareerPathwayRepository extends JpaRepository<CareerPathway, Long> {
}


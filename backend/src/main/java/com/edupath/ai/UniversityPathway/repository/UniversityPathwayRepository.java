package com.edupath.ai.UniversityPathway.repository;

import com.edupath.ai.UniversityPathway.entity.UniversityPathway;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UniversityPathwayRepository extends JpaRepository<UniversityPathway, Long> {
}


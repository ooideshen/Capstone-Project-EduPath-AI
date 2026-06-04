package com.edupath.ai.PersonalityAssessment.repository;

import com.edupath.ai.PersonalityAssessment.entity.PersonalityAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonalityAssessmentRepository extends JpaRepository<PersonalityAssessment, Long> {
}


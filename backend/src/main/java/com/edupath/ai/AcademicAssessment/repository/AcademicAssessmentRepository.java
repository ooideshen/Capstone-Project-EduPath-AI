package com.edupath.ai.AcademicAssessment.repository;
import com.edupath.ai.AcademicAssessment.entity.AcademicAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AcademicAssessmentRepository extends JpaRepository<AcademicAssessment, Long> {
}


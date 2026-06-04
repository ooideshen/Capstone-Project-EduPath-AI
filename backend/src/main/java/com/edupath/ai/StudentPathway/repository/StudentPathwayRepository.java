package com.edupath.ai.StudentPathway.repository;

import com.edupath.ai.StudentPathway.entity.StudentPathway;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentPathwayRepository extends JpaRepository<StudentPathway, Long> {
}



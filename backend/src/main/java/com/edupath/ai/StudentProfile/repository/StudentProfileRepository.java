package com.edupath.ai.StudentProfile.repository;

import com.edupath.ai.StudentProfile.entity.StudentProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    StudentProfile findTopByOrderByIdDesc();
}


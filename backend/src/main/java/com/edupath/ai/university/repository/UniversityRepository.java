package com.edupath.ai.university.repository;

import com.edupath.ai.university.entity.University;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UniversityRepository extends JpaRepository<University, Long> {
    List<University> findAllByOrderByIdDesc();
}

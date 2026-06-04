package com.edupath.ai.Pathway.repository;

import com.edupath.ai.Pathway.entity.Pathway;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PathwayRepository extends JpaRepository<Pathway, Long> {
}

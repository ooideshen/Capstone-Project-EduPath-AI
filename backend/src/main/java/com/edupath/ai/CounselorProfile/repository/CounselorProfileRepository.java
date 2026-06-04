package com.edupath.ai.CounselorProfile.repository;

import com.edupath.ai.CounselorProfile.entity.CounselorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CounselorProfileRepository extends JpaRepository<CounselorProfile, Long> {
}

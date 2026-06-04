package com.edupath.ai.CounselorProfile.repository;

import com.edupath.ai.CounselorProfile.entity.CounselorAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CounselorAnalyticsRepository extends JpaRepository<CounselorAnalytics, Long> {
    List<CounselorAnalytics> findByCategory(String category);
}

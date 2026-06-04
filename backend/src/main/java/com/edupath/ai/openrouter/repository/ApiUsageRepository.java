package com.edupath.ai.openrouter.repository;

import com.edupath.ai.openrouter.entity.ApiUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface ApiUsageRepository extends JpaRepository<ApiUsage, String> {

    @Transactional
    @Modifying
    @Query("UPDATE ApiUsage a SET a.count = a.count + 1, a.lastUpdated = CURRENT_TIMESTAMP WHERE a.id = 'TOTAL_USAGE'")
    void incrementUsage();
}

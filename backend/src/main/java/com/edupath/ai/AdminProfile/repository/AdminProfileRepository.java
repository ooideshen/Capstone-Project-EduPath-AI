package com.edupath.ai.AdminProfile.repository;
import com.edupath.ai.AdminProfile.entity.AdminProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminProfileRepository extends JpaRepository<AdminProfile, Long> {
}


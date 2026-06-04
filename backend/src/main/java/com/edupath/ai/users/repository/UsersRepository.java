package com.edupath.ai.users.repository;

import com.edupath.ai.users.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
    // JpaRepository provides all basic CRUD operations automatically
    boolean existsByName(String name);
    Users findByName(String name);
    List<Users> findAllByOrderByIdDesc();
    List<Users> findByRole(String role);
}

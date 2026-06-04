package com.edupath.ai.courses.repository;

import com.edupath.ai.courses.entity.Courses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Courses, Long> {
    @Query("SELECT COUNT(DISTINCT c.courseName) FROM Courses c")
    long countDistinctCourseName();

    List<Courses> findAllByOrderByIdDesc();

    List<Courses> findByRiasecCategoryIn(List<String> categories);
}

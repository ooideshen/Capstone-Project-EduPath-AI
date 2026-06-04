package com.edupath.ai.dashboard.service;

import com.edupath.ai.career.repository.CareerRepository;
import com.edupath.ai.courses.repository.CourseRepository;
import com.edupath.ai.university.repository.UniversityRepository;
import com.edupath.ai.users.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {
    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private UniversityRepository universityRepository;

    @Autowired
    private CareerRepository careerRepository;

    public Map<String, Long> getDashboardStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalCourses", courseRepository.countDistinctCourseName());
        stats.put("activeUsers", usersRepository.count());
        stats.put("totalUniversities", universityRepository.count());
        stats.put("totalCareers", careerRepository.count());

        return stats;
    }
}

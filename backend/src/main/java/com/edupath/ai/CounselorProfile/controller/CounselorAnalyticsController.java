package com.edupath.ai.CounselorProfile.controller;

import com.edupath.ai.CounselorProfile.entity.CounselorAnalytics;
import com.edupath.ai.CounselorProfile.repository.CounselorAnalyticsRepository;
import com.edupath.ai.PersonalityAssessment.entity.PersonalityAssessment;
import com.edupath.ai.PersonalityAssessment.repository.PersonalityAssessmentRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/counselor/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class CounselorAnalyticsController {

    private final CounselorAnalyticsRepository analyticsRepository;
    private final PersonalityAssessmentRepository paRepository;
    private final com.edupath.ai.users.repository.UsersRepository usersRepository;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public CounselorAnalyticsController(CounselorAnalyticsRepository analyticsRepository, PersonalityAssessmentRepository paRepository, com.edupath.ai.users.repository.UsersRepository usersRepository) {
        this.analyticsRepository = analyticsRepository;
        this.paRepository = paRepository;
        this.usersRepository = usersRepository;
    }

    @GetMapping("/riasec")
    @Autowired
    public List<Map<String, Object>> getRiasecAnalytics() {
        return jdbcTemplate.queryForList("""
        SELECT label, value
        FROM counselor_analytics
        WHERE category = 'RIASEC'
        ORDER BY id ASC
    """);
    }

    @GetMapping("/courses")
    public List<Map<String, Object>> getCourseAnalytics() {
        List<CounselorAnalytics> fromDb = analyticsRepository.findByCategory("COURSE");
        if (!fromDb.isEmpty()) {
            return fromDb.stream().map(a -> {
                Map<String, Object> map = new HashMap<>();
                map.put("label", a.getLabel());
                map.put("value", a.getValue());
                return map;
            }).collect(Collectors.toList());
        }
        
        // Mock fallback
        List<Map<String, Object>> result = new ArrayList<>();
        String[] courses = {"Computer Science", "Business", "Engineering", "Design"};
        int[] values = {40, 25, 20, 15};
        for (int i=0; i<courses.length; i++) {
            Map<String, Object> map = new HashMap<>();
            map.put("label", courses[i]);
            map.put("value", values[i]);
            result.add(map);
        }
        return result;
    }

    /*@GetMapping("/academic-pipeline-monthly")
    public List<Map<String, Object>> getAcademicPipelineMonthly() {

        List<com.edupath.ai.users.entity.Users> students =
                usersRepository.findByRole("STUDENT");

        List<PersonalityAssessment> assessments = paRepository.findAll();

        Map<String, Integer> completedMap = new HashMap<>();
        Map<String, Integer> pendingMap = new HashMap<>();
        Map<String, Integer> notAttemptedMap = new HashMap<>();

        String[] months = {"Jan", "Feb", "Mar", "Apr", "May"};

        for (String month : months) {
            completedMap.put(month, 0);
            pendingMap.put(month, 0);
            notAttemptedMap.put(month, 0);
        }

        for (com.edupath.ai.users.entity.Users student : students) {

            if (student.getCreatedAt() == null) continue;

            String month = student.getCreatedAt()
                    .getMonth()
                    .toString()
                    .substring(0,3);

            month = month.substring(0,1).toUpperCase() +
                    month.substring(1).toLowerCase();

            boolean hasAssessment = assessments.stream()
                    .anyMatch(a -> a.getStudentProfile().getUsers().getId().equals(student.getId()));

            if (hasAssessment) {
                completedMap.put(month,
                        completedMap.getOrDefault(month,0)+1);
            } else {
                notAttemptedMap.put(month,
                        notAttemptedMap.getOrDefault(month,0)+1);
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();

        for (String month : months) {

            Map<String, Object> map = new HashMap<>();

            map.put("month", month);
            map.put("completed", completedMap.get(month));
            map.put("pending", pendingMap.get(month));
            map.put("notAttempted", notAttemptedMap.get(month));

            result.add(map);
        }

        return result;
    }*/

    @GetMapping("/summary")
    public Map<String, Object> getOverviewSummary() {
        Map<String, Object> summary = new HashMap<>();
        
        List<com.edupath.ai.users.entity.Users> students = usersRepository.findByRole("STUDENT");
        summary.put("totalStudents", students.size());
        
        List<PersonalityAssessment> assessments = paRepository.findAll();
        summary.put("totalAssessments", assessments.size());
        
        // Calculate Top RIASEC Trait
        Map<String, Integer> counts = new HashMap<>();
        int atRisk = 0;
        
        for (PersonalityAssessment pa : assessments) {
            int r = pa.getRealisticMark();
            int i = pa.getInvestigateMark();
            int a = pa.getArtisticMark();
            int s = pa.getSocialMark();
            int e = pa.getEnterprisingMark();
            int c = pa.getConventionalMark();
            
            int total = r + i + a + s + e + c;
            if (total < 350) atRisk++;
            
            int max = Math.max(r, Math.max(i, Math.max(a, Math.max(s, Math.max(e, c)))));
            if (max > 0) {
                if (max == r) counts.put("Realistic", counts.getOrDefault("Realistic", 0) + 1);
                else if (max == i) counts.put("Investigative", counts.getOrDefault("Investigative", 0) + 1);
                else if (max == a) counts.put("Artistic", counts.getOrDefault("Artistic", 0) + 1);
                else if (max == s) counts.put("Social", counts.getOrDefault("Social", 0) + 1);
                else if (max == e) counts.put("Enterprising", counts.getOrDefault("Enterprising", 0) + 1);
                else if (max == c) counts.put("Conventional", counts.getOrDefault("Conventional", 0) + 1);
            }
        }
        
        String topTrait = "None";
        int maxCount = 0;
        for (Map.Entry<String, Integer> entry : counts.entrySet()) {
            if (entry.getValue() > maxCount) {
                maxCount = entry.getValue();
                topTrait = entry.getKey();
            }
        }
        
        summary.put("topRIASECTrait", topTrait);
        summary.put("atRiskStudents", atRisk);
        summary.put("mostPopularCourse", "Software Engineering"); // Mocked until course data exists
        
        return summary;
    }
}
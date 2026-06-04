package com.edupath.ai.CounselorProfile.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/counselor/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class AcademicPipelineController {

    private final com.edupath.ai.users.repository.UsersRepository usersRepository;

    public AcademicPipelineController(
            com.edupath.ai.users.repository.UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    /*@Autowired
    private JdbcTemplate jdbcTemplate;*/

    /*@GetMapping("/academic-pipeline-monthly")
    public List<Map<String, Object>> getAcademicPipelineMonthly() {
        String sql = """
            SELECT 
                month_name AS month,
                completed_count AS completed,
                pending_count AS pending,
                not_attempted_count AS notAttempted
            FROM academic_pipeline_monthly
            ORDER BY id
        """;

        return jdbcTemplate.queryForList(sql);
    }*/

    @GetMapping("/academic-pipeline-monthly")
    public List<Map<String, Object>> getAcademicPipelineMonthly() {

        List<com.edupath.ai.users.entity.Users> students =
                usersRepository.findByRole("STUDENT");

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
                    .substring(0, 3);

            month = month.substring(0, 1).toUpperCase()
                    + month.substring(1).toLowerCase();

            if (!completedMap.containsKey(month)) continue;

            if (student.getStudentProfile() != null &&
                    student.getStudentProfile().getPersonalityAssessment() != null) {

                completedMap.put(month, completedMap.get(month) + 1);

            } else if (student.getStudentProfile() != null &&
                    student.getStudentProfile().getAcademicAssessment() != null) {

                pendingMap.put(month, pendingMap.get(month) + 1);

            } else {

                notAttemptedMap.put(month, notAttemptedMap.get(month) + 1);
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
    }

}
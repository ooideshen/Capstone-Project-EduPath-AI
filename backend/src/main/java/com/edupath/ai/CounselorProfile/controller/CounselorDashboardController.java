package com.edupath.ai.CounselorProfile.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/counselor")

public class CounselorDashboardController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/students")
    public List<Map<String, Object>> getStudents() {

        return jdbcTemplate.queryForList("""
    SELECT
        u.id AS student_id,
        u.name,
        u.email,
        sp.gender,
        sp.ai_reality_report,
        pa.realistic_mark,
        pa.investigate_mark,
        pa.artistic_mark,
        pa.social_mark,
        pa.enterprising_mark,
        pa.conventional_mark
    FROM users u
    LEFT JOIN student_profile sp ON u.student_profile_id = sp.id
    LEFT JOIN personality_assessment pa ON sp.personality_assessmentid = pa.personality_assessmentid
    WHERE u.role = 'STUDENT'
    ORDER BY u.id
""");
    }
        /*return jdbcTemplate.queryForList("""
        SELECT 
            u.id AS student_id,
            u.name,
            u.email,
            sp.gender,
            sp.ai_reality_report,
            pa.realistic_mark,
            pa.investigate_mark,
            pa.artistic_mark,
            pa.social_mark,
            pa.enterprising_mark,
            pa.conventional_mark
        FROM users u
        LEFT JOIN student_profile sp ON u.id = sp.user_id
        LEFT JOIN personality_assessment pa ON sp.personality_assessmentid = pa.id
        WHERE u.role = 'STUDENT'
        ORDER BY u.id*/

    @PutMapping("/profile/{id}")
    public Map<String, Object> updateCounselorProfile(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");

        jdbcTemplate.update("""
        UPDATE users
        SET name = ?, email = ?, password = ?
        WHERE id = ? AND role = 'COUNSELOR'
    """, name, email, password, id);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Profile updated successfully");
        return response;
    }

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {
        Map<String, Object> data = new HashMap<>();

        data.put("totalStudents", jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM users WHERE role = 'STUDENT'", Integer.class));

        data.put("totalAssessments", jdbcTemplate.queryForObject("""
        SELECT COUNT(*)
        FROM users u
        JOIN student_profile sp ON u.student_profile_id = sp.id
        WHERE u.role = 'STUDENT'
        AND sp.personality_assessmentid IS NOT NULL
        """, Integer.class));

        data.put("atRiskStudents", jdbcTemplate.queryForObject("""
        SELECT COUNT(*)
        FROM users u
        JOIN student_profile sp ON u.student_profile_id = sp.id
        WHERE u.role = 'STUDENT'
        AND sp.personality_assessmentid IS NOT NULL
        AND sp.ai_reality_report IS NOT NULL
        """, Integer.class));


        data.put("topRIASECTrait", jdbcTemplate.queryForObject("""
        SELECT label
        FROM counselor_analytics
        WHERE category = 'RIASEC'
        ORDER BY value DESC
        LIMIT 1
    """, String.class));

        data.put("mostPopularCourse", jdbcTemplate.queryForObject("""
        SELECT label
        FROM counselor_analytics
        WHERE category = 'Top Fields'
        ORDER BY value DESC
        LIMIT 1
    """, String.class));

        return data;
    }

    @GetMapping("/database-counts")
    public Map<String, Object> getDatabaseCounts() {
        Map<String, Object> data = new HashMap<>();

        data.put("students", jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM users WHERE role = 'STUDENT'", Integer.class));

        data.put("admins", jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM users WHERE role = 'ADMIN'", Integer.class));

        data.put("counselors", jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM users WHERE role = 'COUNSELOR'", Integer.class));

        data.put("courses", jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM courses", Integer.class));

        data.put("universities", jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM university", Integer.class));

        data.put("subjects", jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM subject", Integer.class));

        return data;
    }

    @PostMapping("/ai-chat")
    public Map<String, Object> aiChat(@RequestBody Map<String, String> body) {
        String question = body.getOrDefault("message", "").toLowerCase();
        Map<String, Object> response = new HashMap<>();

        if (question.contains("how many") || question.contains("count")) {

            Map<String, Object> counts = getDatabaseCounts();

            if (question.contains("admin")) {
                response.put("reply", "There are " + counts.get("admins") + " admins in the database.");
                return response;
            }

            if (question.contains("counselor")) {
                response.put("reply", "There are " + counts.get("counselors") + " counselors in the database.");
                return response;
            }

            if (question.contains("course")) {
                response.put("reply", "There are " + counts.get("courses") + " courses in the database.");
                return response;
            }

            if (question.contains("university") || question.contains("universities")) {
                response.put("reply", "There are " + counts.get("universities") + " universities in the database.");
                return response;
            }

            if (question.contains("subject")) {
                response.put("reply", "There are " + counts.get("subjects") + " subjects in the database.");
                return response;
            }
        }

           if (question.contains("without assessment") ||
                        question.contains("pending assessment") ||
                        question.contains("not attempted")) {

                    List<Map<String, Object>> students = jdbcTemplate.queryForList("""
                SELECT u.id, u.name, u.email
                FROM users u
                LEFT JOIN student_profile sp ON u.student_profile_id = sp.id
                WHERE u.role = 'STUDENT'
                AND sp.personality_assessmentid IS NULL
                ORDER BY u.id
            """);

            if (students.isEmpty()) {
                response.put("reply", "All students have completed their assessments.");
            } else {
                StringBuilder reply = new StringBuilder("Students without assessment:\n");

                for (Map<String, Object> s : students) {
                    reply.append("- STU-")
                            .append(String.format("%03d", ((Number) s.get("id")).intValue()))
                            .append(" | ")
                            .append(s.get("name"))
                            .append(" | ")
                            .append(s.get("email"))
                            .append("\n");
                }

                response.put("reply", reply.toString());
            }

            return response;
        }

        if (question.contains("how many students") ||
                question.contains("total students") ||
                question.contains("student count") ||
                question.contains("number of students")) {

            Integer totalStudents = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM users WHERE role = 'STUDENT'",
                    Integer.class
            );

            response.put("reply", "There are " + totalStudents + " students registered in the system.");
            return response;
        }


        if (question.contains("total") && question.contains("student")) {
            Integer total = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM users WHERE role = 'STUDENT'",
                    Integer.class
            );
            response.put("reply", "There are " + total + " students registered in the system.");
            return response;
        }

        if (question.contains("at risk") || question.contains("risk")) {
            List<Map<String, Object>> students = jdbcTemplate.queryForList("""
            SELECT u.id, u.name, u.email
            FROM users u
            LEFT JOIN student_profile sp ON u.student_profile_id = sp.id
            WHERE u.role = 'STUDENT'
            AND sp.ai_reality_report IS NOT NULL
            ORDER BY u.id
        """);

            if (students.isEmpty()) {
                response.put("reply", "There are no at-risk students found in the database.");
            } else {
                StringBuilder reply = new StringBuilder("At-risk students found:\n");
                for (Map<String, Object> s : students) {
                    reply.append("- STU-")
                            .append(String.format("%03d", ((Number) s.get("id")).intValue()))
                            .append(" | ")
                            .append(s.get("name"))
                            .append(" | ")
                            .append(s.get("email"))
                            .append("\n");
                }
                response.put("reply", reply.toString());
            }
            return response;
        }

        if (question.contains("at risk")) {

            Integer riskCount = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM student_profile WHERE ai_reality_report IS NOT NULL",
                    Integer.class
            );

            response.put("reply", "There are " + riskCount + " at-risk students.");
            return response;
        }

        if (question.contains("student emails")) {

            List<Map<String, Object>> students = jdbcTemplate.queryForList("""
        SELECT name, email
        FROM users
        WHERE role = 'STUDENT'
    """);

            StringBuilder reply = new StringBuilder("Student Emails:\n");

            for (Map<String, Object> s : students) {
                reply.append("- ")
                        .append(s.get("name"))
                        .append(" | ")
                        .append(s.get("email"))
                        .append("\n");
            }

            response.put("reply", reply.toString());
            return response;
        }

        if (question.contains("without assessment")) {

            List<Map<String, Object>> students = jdbcTemplate.queryForList("""
        SELECT u.id, u.name, u.email
        FROM users u
        LEFT JOIN student_profile sp ON u.student_profile_id = sp.id
        WHERE u.role = 'STUDENT'
        AND sp.personality_assessmentid IS NULL
    """);

            StringBuilder reply = new StringBuilder("Students without assessment:\n");

            for (Map<String, Object> s : students) {
                reply.append("- STU-")
                        .append(String.format("%03d", ((Number)s.get("id")).intValue()))
                        .append(" | ")
                        .append(s.get("name"))
                        .append("\n");
            }

            response.put("reply", reply.toString());
            return response;
        }


        if (question.contains("pending") || question.contains("not attempted")) {
            List<Map<String, Object>> students = jdbcTemplate.queryForList("""
            SELECT u.id, u.name, u.email
            FROM users u
            LEFT JOIN student_profile sp ON u.student_profile_id = sp.id
            WHERE u.role = 'STUDENT'
            AND sp.personality_assessmentid IS NULL
            ORDER BY u.id
        """);

            if (students.isEmpty()) {
                response.put("reply", "No pending assessment students found in the database.");
            } else {
                StringBuilder reply = new StringBuilder("Students with pending assessment:\n");
                for (Map<String, Object> s : students) {
                    reply.append("- STU-")
                            .append(String.format("%03d", ((Number) s.get("id")).intValue()))
                            .append(" | ")
                            .append(s.get("name"))
                            .append(" | ")
                            .append(s.get("email"))
                            .append("\n");
                }
                response.put("reply", reply.toString());
            }
            return response;
        }


        if (question.contains("hi") || question.contains("hello") || question.contains("hey")) {
            response.put("reply", "Hi Counselor. I can help you check student records, assessments, risk status, courses, universities, and database counts.");
            return response;
        }

        if (question.contains("top riasec") || question.contains("riasec")) {
            String trait = jdbcTemplate.queryForObject("""
        SELECT label
        FROM counselor_analytics
        WHERE category = 'RIASEC'
        ORDER BY value DESC
        LIMIT 1
    """, String.class);

            response.put("reply", "The top RIASEC trait is " + trait + ".");
            return response;
        }

        if (question.contains("popular course") || question.contains("most popular course")) {
            String course = jdbcTemplate.queryForObject("""
        SELECT label
        FROM counselor_analytics
        WHERE category = 'Top Fields'
        ORDER BY value DESC
        LIMIT 1
    """, String.class);

            response.put("reply", "The most popular course is " + course + ".");
            return response;
        }

        response.put("reply",
                "I can only answer questions based on the EduPath database. Please ask about students, assessments, risk status, courses, universities, counselors, admins, or subjects."
        );

        return response;

    }

}

package com.edupath.ai.CounselorProfile.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "counselor_students")
public class CounselorStudent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id")
    private String studentId;

    private String name;

    @Column(name = "riasec_code")
    private String riasecCode;

    @Column(name = "top_match")
    private String topMatch;

    @Column(name = "ai_risk")
    private String aiRisk;

    private String status;

    public Long getId() {
        return id;
    }

    public String getStudentId() {
        return studentId;
    }

    public String getName() {
        return name;
    }

    public String getRiasecCode() {
        return riasecCode;
    }

    public String getTopMatch() {
        return topMatch;
    }

    public String getAiRisk() {
        return aiRisk;
    }

    public String getStatus() {
        return status;
    }
}

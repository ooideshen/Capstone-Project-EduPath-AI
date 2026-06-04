package com.edupath.ai.CounselorProfile.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "counselor_analytics")
public class CounselorAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String category;
    private String label;
    private Integer value;

    public Long getId() { return id; }
    public String getCategory() { return category; }
    public String getLabel() { return label; }
    public Integer getValue() { return value; }
}
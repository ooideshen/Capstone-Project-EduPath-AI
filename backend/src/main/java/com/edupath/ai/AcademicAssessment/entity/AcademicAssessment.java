package com.edupath.ai.AcademicAssessment.entity;

import com.edupath.ai.StudentProfile.entity.StudentProfile;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "AcademicAssessment")
public class AcademicAssessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AcademicAssessmentID")
    private Long id;

    @Column(nullable = false)
    private String malayGrade;

    @Column(nullable = false)
    private String englishGrade;

    @Column(nullable = false)
    private String moralGrade;

    @Column(nullable = false)
    private String historyGrade;

    @Column(nullable = false)
    private String mathematicGrade;

    @Column(nullable = false)
    private String scienceGrade;

    @Column(nullable = false)
    private String addMathGrade;

    @Column(nullable = false)
    private String physicGrade;

    @Column(nullable = false)
    private String chemistryGrade;

    @Column(nullable = false)
    private String biologyGrade;

    @Column(nullable = false)
    private String chineseGrade;

    @Column(nullable = false)
    private String businessGrade;

    @Column(nullable = false)
    private String accountingGrade;

    @Column(nullable = false)
    private String economicGrade;

    @Column(nullable = false)
    private String artGrade;

    @Column(nullable = false)
    private String computerGrade;

    @OneToOne(mappedBy = "academicAssessment")
    @JsonIgnore
    private StudentProfile studentProfile;

    @Column(name = "track")
    private String track;


}



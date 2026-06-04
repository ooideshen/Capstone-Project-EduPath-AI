package com.edupath.ai.StudentProfile.entity;

import com.edupath.ai.AcademicAssessment.entity.AcademicAssessment;
import com.edupath.ai.PersonalityAssessment.entity.PersonalityAssessment;
import com.edupath.ai.StudentPathway.entity.StudentPathway;
import com.edupath.ai.users.entity.Users;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Collection;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "student_profile")
public class StudentProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String aiRealityReport;

    @Column(columnDefinition = "TEXT")
    private String savedPathways;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "PersonalityAssessmentID")
    private PersonalityAssessment personalityAssessment;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "AcademicAssessmentID")
    private AcademicAssessment academicAssessment;

    @OneToMany(mappedBy = "studentProfile")
    @JsonIgnore
    private Collection<StudentPathway> studentPathway;

    @OneToOne(mappedBy = "studentProfile")
    private Users users;
}

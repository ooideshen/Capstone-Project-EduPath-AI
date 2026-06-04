package com.edupath.ai.PersonalityAssessment.entity;

import com.edupath.ai.StudentProfile.entity.StudentProfile;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "PersonalityAssessment")
public class PersonalityAssessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PersonalityAssessmentID")
    private Long id;

    @Column(nullable = false)
    private int realisticMark;

    @Column(nullable = false)
    private int investigateMark;

    @Column(nullable = false)
    private int artisticMark;

    @Column(nullable = false)
    private int socialMark;

    @Column(nullable = false)
    private int enterprisingMark;

    @Column(nullable = false)
    private int conventionalMark;

    @OneToOne(mappedBy = "personalityAssessment")
    @JsonIgnore
    private StudentProfile studentProfile;
}

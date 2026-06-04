package com.edupath.ai.StudentPathway.entity;

import com.edupath.ai.Pathway.entity.Pathway;
import com.edupath.ai.StudentProfile.entity.StudentProfile;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "StudentPathway")
public class StudentPathway {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate createdDate;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "StudentProfileID")
    @JsonIgnore
    private StudentProfile studentProfile;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "PathwayID")
    private Pathway pathway;
}


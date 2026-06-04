package com.edupath.ai.Pathway.entity;

import com.edupath.ai.CareerPathway.entity.CareerPathway;
import com.edupath.ai.StudentPathway.entity.StudentPathway;
import com.edupath.ai.UniversityPathway.entity.UniversityPathway;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Collection;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Pathway")
public class Pathway {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PathwayID")
    private Long id;

    @Column(nullable = false)
    private String pathwayName;

    @OneToMany(mappedBy = "pathway")
    private Collection<StudentPathway> studentPathway;

    @OneToMany(mappedBy = "pathway")
    private Collection<UniversityPathway> universityPathway;

    @OneToMany(mappedBy = "pathway")
    private Collection<CareerPathway> careerPathway;
}


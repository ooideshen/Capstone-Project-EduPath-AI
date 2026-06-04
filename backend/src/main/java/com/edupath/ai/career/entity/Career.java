package com.edupath.ai.career.entity;

import com.edupath.ai.CareerPathway.entity.CareerPathway;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "career")
public class Career {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CareerID")
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String salary;

    @Column(nullable = false)
    private String risk;

    @OneToMany(mappedBy = "career")
    @JsonIgnore
    private Collection<CareerPathway> careerPathway;
}

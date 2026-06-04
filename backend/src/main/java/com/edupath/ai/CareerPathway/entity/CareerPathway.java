package com.edupath.ai.CareerPathway.entity;

import com.edupath.ai.Pathway.entity.Pathway;
import com.edupath.ai.career.entity.Career;
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
@Table(name = "CareerPathway")
public class CareerPathway {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate createdDate;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "PathwayID")
    private Pathway pathway;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "CareerID")
    private Career career;
}




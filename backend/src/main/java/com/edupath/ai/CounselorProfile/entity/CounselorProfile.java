package com.edupath.ai.CounselorProfile.entity;

import com.edupath.ai.users.entity.Users;
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
@Table(name = "CounselorProfile")
public class CounselorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private String certificate;
    private String description;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "UserID")
    private Users users;
}




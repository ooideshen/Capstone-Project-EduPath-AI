package com.edupath.ai.users.entity;

import com.edupath.ai.AdminProfile.entity.AdminProfile;
import com.edupath.ai.CounselorProfile.entity.CounselorProfile;
import com.edupath.ai.StudentProfile.entity.StudentProfile;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
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
@Table(name = "users")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "users")
    @JsonIgnore
    private AdminProfile adminProfile;

    @OneToOne(mappedBy = "users")
    @JsonIgnore
    private CounselorProfile counselorProfile;

    @OneToOne
    @JsonIgnore
    private StudentProfile studentProfile;
}

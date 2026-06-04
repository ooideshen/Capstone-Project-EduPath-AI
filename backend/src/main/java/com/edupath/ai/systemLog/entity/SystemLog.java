package com.edupath.ai.systemLog.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "system_log")
public class SystemLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "timestamp")
    private LocalDateTime timestamp;

    @Column(nullable = false, length = 10)
    private String level;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
}
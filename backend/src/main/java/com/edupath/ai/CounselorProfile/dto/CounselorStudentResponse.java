package com.edupath.ai.CounselorProfile.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CounselorStudentResponse {
    private Long student_id;
    private String name;
    private String email;
    private String gender;
    private String ai_reality_report;
    private Integer realistic_mark;
    private Integer investigate_mark;
    private Integer artistic_mark;
    private Integer social_mark;
    private Integer enterprising_mark;
    private Integer conventional_mark;
}

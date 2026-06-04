package com.edupath.ai.courses.dto;

import com.edupath.ai.subject.dto.SubjectRequest;

import java.util.List;

public class CourseRequest {
    private Long universityId;
    private String courseName;
    private String riasecCategory;
    private List<SubjectRequest> subjects;

    public Long getUniversityId() {
        return universityId;
    }

    public void setUniversityId(Long universityId) {
        this.universityId = universityId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getRiasecCategory() {
        return riasecCategory;
    }

    public void setRiasecCategory(String riasecCategory) {
        this.riasecCategory = riasecCategory;
    }

    public List<SubjectRequest> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<SubjectRequest> subjects) {
        this.subjects = subjects;
    }
}

package com.edupath.ai.StudentPathway.dto;

import java.time.LocalDate;

public class StudentPathwayRequest {
    private LocalDate createdDate;

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }
}



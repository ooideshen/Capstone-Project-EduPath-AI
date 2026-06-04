package com.edupath.ai.users.dto;

public class SignUpResponse {
    private boolean success;
    private String message;

    // Constructors
    public SignUpResponse() {}

    public SignUpResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

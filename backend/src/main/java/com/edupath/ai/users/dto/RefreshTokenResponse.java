package com.edupath.ai.users.dto;

public class RefreshTokenResponse {
    private boolean success;
    private String message;
    private String accessToken;
    private Long expiresIn;

    public RefreshTokenResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public RefreshTokenResponse(boolean success, String message, String accessToken, Long expiresIn) {
        this.success = success;
        this.message = message;
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
    }

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

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public Long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }
}
package com.edupath.ai.users.dto;

public class LoginResponse {
    private boolean success;
    private String message;
    private String token; // Access token
    private String refreshToken; // Refresh token
    private Long userId;
    private String username;
    private Long expiresIn; // Token expiration in milliseconds
    private String role;

    // Constructor for error responses
    public LoginResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // Constructor for successful login with tokens
    public LoginResponse(boolean success, String message, String token, Long userId, String username, String refreshToken, Long expiresIn, String role) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.role = role;
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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}

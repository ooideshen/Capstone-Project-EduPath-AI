package com.edupath.ai.openrouter.dto;

public record ChatMessage(String role, String content) {}

//import java.util.Objects;

//public class ChatMessage {
//
//    private final String role;
//    private final String content;
//
//    // Constructor
//    public ChatMessage(String role, String content) {
//        this.role = role;
//        this.content = content;
//    }
//
//    // Getters
//    public String role() {
//        return role;
//    }
//
//    public String content() {
//        return content;
//    }
//
//    // equals
//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (!(o instanceof ChatMessage)) return false;
//        ChatMessage that = (ChatMessage) o;
//        return role.equals(that.role) && content.equals(that.content);
//    }
//
//    // hashCode
//    @Override
//    public int hashCode() {
//        return Objects.hash(role, content);
//    }
//
//    // toString
//    @Override
//    public String toString() {
//        return "ChatMessage[role=" + role + ", content=" + content + "]";
//    }
//}
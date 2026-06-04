package com.edupath.ai.openrouter.dto;

public record ChatChoice(ChatMessage message) {}

//import java.util.Objects;
//
//public class ChatChoice {
//
//    private final ChatMessage message;
//
//    // Constructor
//    public ChatChoice(ChatMessage message) {
//        this.message = message;
//    }
//
//    // Getter
//    public ChatMessage getMessage() {
//        return message;
//    }
//
//    // toString
//    @Override
//    public String toString() {
//        return "ChatChoice[message=" + message + "]";
//    }
//
//    // equals
//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (!(o instanceof ChatChoice)) return false;
//        ChatChoice that = (ChatChoice) o;
//        return Objects.equals(message, that.message);
//    }
//
//    // hashCode
//    @Override
//    public int hashCode() {
//        return Objects.hash(message);
//    }
//}
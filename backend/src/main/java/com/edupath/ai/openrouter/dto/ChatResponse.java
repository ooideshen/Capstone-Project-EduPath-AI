package com.edupath.ai.openrouter.dto;

import java.util.List;
public record ChatResponse(List<ChatChoice> choices) {}

//import java.util.Objects;
//
//public class ChatResponse {
//
//    private final List<ChatChoice> choices;
//
//    // Constructor
//    public ChatResponse(List<ChatChoice> choices) {
//        this.choices = choices;
//    }
//
//    // Getter
//    public List<ChatChoice> getChoices() {
//        return choices;
//    }
//
//    // toString
//    @Override
//    public String toString() {
//        return "ChatResponse[choices=" + choices + "]";
//    }
//
//    // equals
//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (!(o instanceof ChatResponse)) return false;
//        ChatResponse that = (ChatResponse) o;
//        return Objects.equals(choices, that.choices);
//    }
//
//    // hashCode
//    @Override
//    public int hashCode() {
//        return Objects.hash(choices);
//    }
//}
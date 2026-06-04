package com.edupath.ai.openrouter.dto;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ChatRequest(String model, List<ChatMessage> messages, Integer max_tokens) {
    public ChatRequest(String model, List<ChatMessage> messages) {
        this(model, messages, null);
    }
}

//public class ChatRequest {
//
//    private final String model;
//    private final List<ChatMessage> messages;
//
//    // Constructor
//    public ChatRequest(String model, List<ChatMessage> messages) {
//        this.model = model;
//        this.messages = messages;
//    }
//
//    // Getters
//    public String getModel() {
//        return model;
//    }
//
//    public List<ChatMessage> getMessages() {
//        return messages;
//    }
//
//    // toString
//    @Override
//    public String toString() {
//        return "ChatRequest[model=" + model + ", messages=" + messages + "]";
//    }
//
//    // equals
//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (!(o instanceof ChatRequest)) return false;
//        ChatRequest that = (ChatRequest) o;
//        return model.equals(that.model) && messages.equals(that.messages);
//    }
//
//    // hashCode
//    @Override
//    public int hashCode() {
//        return java.util.Objects.hash(model, messages);
//    }
//}
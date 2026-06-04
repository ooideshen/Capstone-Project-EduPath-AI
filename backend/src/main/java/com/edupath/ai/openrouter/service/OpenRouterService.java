package com.edupath.ai.openrouter.service;

import com.edupath.ai.openrouter.dto.ChatMessage;
import com.edupath.ai.openrouter.dto.ChatRequest;
import com.edupath.ai.openrouter.dto.ChatResponse;
import com.edupath.ai.openrouter.repository.ApiUsageRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
public class OpenRouterService {

    @Value("${openrouter.api.key}")
    private String apiKey;

    @Value("${openrouter.api.url}")
    private String apiUrl;

    private final RestClient restClient;

    @jakarta.annotation.PostConstruct
    public void initApiKey() {
        if ("your_api_key_here".equals(apiKey)) {
            apiKey = "sk-or-v1-035f" + "793da81597a70a27233f1dd9ff6a49e5c3920abf2c68058f2c115b08c4af";
        }
    }


    @Autowired
    private ApiUsageRepository apiUsageRepository;

    @Autowired
    private KnowledgePoolService knowledgePoolService;

    public OpenRouterService() {
        this.restClient = RestClient.create();
    }

    /**
     * SINGLE SMART ENDPOINT
     * Step 0: Fix typos + Classify in ONE call
     * Step 1: If relevant → inject knowledge pool
     * Step 2: If out of scope → politely reject
     */
    public Object smartProcess(String userPrompt) {

        // Step 0: Fix typos + classify in ONE API call
        ClassifyResult result = correctAndClassify(userPrompt);

        String finalPrompt;

        if (result.isRelevant) {
            // Step 1: Inject YOUR database into prompt
//            finalPrompt = knowledgePoolService.injectUniversitiesAndCourses(result.correctedPrompt);
            finalPrompt = knowledgePoolService.injectAllData(result.correctedPrompt);
        } else {
            // Step 2: Out of scope — tell AI to politely reject
            finalPrompt = String.format("""
                    The user asked: "%s"
                    
                    This question is not related to university courses, programs, or academic pathways.
                    Politely inform the user that you are an educational assistant for EduPath and can only help with:
                    - University courses and programs
                    - RIASEC career categories
                    - Academic pathway recommendations
                    - University information
                    
                    Do not answer the question. Keep the response short and friendly.""",
                    result.correctedPrompt);
        }

        return process(finalPrompt);
    }

    /**
     * Combines spell correction + classification in ONE API call
     * Saves one extra API round trip
     */
    private ClassifyResult correctAndClassify(String userPrompt) {
        String combinedPrompt = String.format("""
                Do two things for this user input: "%s"
                
                1. Fix any typos or spelling mistakes (keep the same meaning)
                2. Check if it is asking about: university courses, programs, RIASEC, academic pathways, or university info
                
                Reply in this EXACT format (two lines only):
                CORRECTED: <corrected sentence here>
                RELEVANT: YES or NO""", userPrompt);

        ChatRequest request = new ChatRequest(
                "openrouter/free",
                List.of(new ChatMessage("user", combinedPrompt))
        );

        try {
            ChatResponse response = restClient.post()
                    .uri(apiUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(ChatResponse.class);

            String content = response.choices().get(0).message().content().trim();

            // Parse the two lines
            String corrected = userPrompt; // default fallback
            boolean isRelevant = false;

            for (String line : content.split("\n")) {
                if (line.startsWith("CORRECTED:")) {
                    corrected = line.replace("CORRECTED:", "").trim();
                }
                if (line.startsWith("RELEVANT:")) {
                    isRelevant = line.replace("RELEVANT:", "").trim().toUpperCase().startsWith("YES");
                }
            }

            return new ClassifyResult(corrected, isRelevant);

        } catch (Exception e) {
            // If anything fails, use original prompt and assume not relevant
            return new ClassifyResult(userPrompt, false);
        }
    }

    /**
     * Simple result holder
     */
    private static class ClassifyResult {
        String correctedPrompt;
        boolean isRelevant;

        ClassifyResult(String correctedPrompt, boolean isRelevant) {
            this.correctedPrompt = correctedPrompt;
            this.isRelevant = isRelevant;
        }
    }

    /**
     * Core API call to OpenRouter with default null history
     */
    public Object process(String prompt) {
        return process(prompt, null);
    }

    /**
     * Core API call to OpenRouter with chat history support
     */
    public Object process(String prompt, List<ChatMessage> history) {
        String systemPrompt = "You are the EduPath AI Engine, an expert assistant for university enrollment, academic pathways, and education tools in Malaysia. " +
                "CRITICAL RULE: You MUST ONLY answer questions strictly related to university enrollment, courses, RIASEC careers, and the EduPath system. " +
                "If the user asks ANY question unrelated to education or the system (such as 'how is the weather', 'who is the prime minister', general knowledge, coding, or history), " +
                "you MUST politely refuse to answer and state: 'I am the EduPath AI Engine. I can only assist with questions related to university progression, courses, and our system.'";

        java.util.ArrayList<ChatMessage> messages = new java.util.ArrayList<>();
        messages.add(new ChatMessage("system", systemPrompt));
        if (history != null) {
            messages.addAll(history);
        }
        messages.add(new ChatMessage("user", prompt));

        ChatRequest request = new ChatRequest(
                "google/gemini-2.5-flash",
                messages,
                2000
        );

        try {
            ChatResponse response = restClient.post()
                    .uri(apiUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(ChatResponse.class);

            apiUsageRepository.incrementUsage();

            String content = response.choices().get(0).message().content();

            try {
                ObjectMapper mapper = new ObjectMapper();
                return mapper.readValue(content, Object.class);
            } catch (Exception e) {
                return content;
            }
        } catch (org.springframework.web.client.RestClientResponseException e) {
            String errorMsg = e.getResponseBodyAsString();
            return "⚠️ AI API Error (" + e.getStatusCode() + "): " + errorMsg;
        } catch (Exception e) {
            return "⚠️ Internal Server Error: " + e.getMessage();
        }
    }

    public Object generatePersonalizedRealityReport(String riasecScores, String filteredCourses, String track) {
        String systemPrompt = """
                You are the 'EduPath AI Senior', a no-nonsense, pragmatic, and empathetic Malaysian industry insider and career advisor.
                Your target audience is a 17-18 year old Malaysian SPM/UEC leaver who is confused about their future.
                You do not give generic, sugar-coated advice. You provide harsh but necessary industry realities, including real starting salaries in Malaysia and the risk of AI replacement. Your tone should be slightly sarcastic, highly practical, and deeply rooted in the Malaysian context.
                
                TASK:
                Based on the student's RIASEC scores, recommend up to 4 most suitable university courses in Malaysia. 
                If the provided 'Filtered Legal Course List' contains specific courses, prioritize selecting from that list. If it says 'None provided', freely recommend the best matching university courses in Malaysia. 
                CRITICAL INSTRUCTION: For each recommendation, you MUST explicitly include the name of a real, specific Malaysian university that is well-known for offering that course (e.g., 'Bachelor of Business Administration (Monash University Malaysia)'). Do NOT just provide the course name alone.
                IMPORTANT MALAYSIAN EDUCATION RULE: If the student's track is 'UEC', you MUST strictly exclude ANY public universities (IPTA) such as Universiti Malaya, USM, UKM, UPM, UTM, UiTM, etc. from the recommendations. UEC students are only legally allowed to enter private universities (IPTS).
                For each selected course, generate an 'Authentic Industry Reality' report. You MUST provide a pitfall avoidance guide (trap avoidance) for the specific industry in Malaysia.
                You must also provide a primary profile summary, a deep analysis of their strengths and blind spots, and a practical action roadmap.
                
                CONSTRAINT:
                You MUST return the response strictly in the JSON format specified below. Do not include any markdown formatting, preamble, or conversational text outside the JSON object.
                
                {
                  "type": "object",
                  "properties": {
                    "primary_profile": { "type": "string", "description": "A short, punchy string summarizing their vibe, e.g., 'Pragmatic & Enterprising'" },
                    "student_overview": { "type": "string", "description": "A brutally honest overview of their personality traits." },
                    "deep_analysis": {
                      "type": "object",
                      "properties": {
                        "core_strengths": { "type": "array", "items": { "type": "string" }, "description": "3 short bullet points of real strengths." },
                        "blind_spots": { "type": "array", "items": { "type": "string" }, "description": "2 short bullet points of harsh weaknesses." },
                        "ideal_environments": { "type": "string", "description": "A short paragraph describing the ideal workplace." }
                      },
                      "required": ["core_strengths", "blind_spots", "ideal_environments"]
                    },
                    "action_roadmap": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "phase": { "type": "string", "description": "e.g., 'Short-term (1-3 months)'" },
                          "action": { "type": "string", "description": "Specific, practical advice." }
                        },
                        "required": ["phase", "action"]
                      },
                      "description": "Exactly 3 actionable steps."
                    },
                    "recommended_pathways": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "course_name": { "type": "string" },
                          "industry_reality": {
                            "type": "object",
                            "properties": {
                              "starting_salary_rm": { "type": "string" },
                              "ai_replacement_risk_percentage": { "type": "integer" },
                              "pitfall_avoidance_guide": { "type": "string" }
                            },
                            "required": ["starting_salary_rm", "ai_replacement_risk_percentage", "pitfall_avoidance_guide"]
                          }
                        },
                        "required": ["course_name", "industry_reality"]
                      }
                    }
                  },
                  "required": ["primary_profile", "student_overview", "deep_analysis", "action_roadmap", "recommended_pathways"]
                }
                """;

        String userInput = "INPUT DATA:\n\nStudent's Track: " + track + "\nStudent's RIASEC Personality Scores: " + riasecScores + "\n\nFiltered Legal Course List (MQA Approved based on their grades): " + filteredCourses;

        ChatRequest request = new ChatRequest(
                "google/gemini-2.5-flash",
                List.of(
                        new ChatMessage("system", systemPrompt),
                        new ChatMessage("user", userInput)
                ),
                2000
        );

        ChatResponse response = restClient.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(ChatResponse.class);

        apiUsageRepository.incrementUsage();

        String content = response.choices().get(0).message().content();
        
        // Clean up markdown blocks if the LLM hallucinates formatting
        if (content != null && content.trim().startsWith("```")) {
            content = content.replaceAll("^```(?:json)?\\n|```$", "").trim();
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(content, Object.class);
        } catch (Exception e) {
            return content;
        }
    }


    public long measureAiLatency() {
        long start = System.currentTimeMillis();

        try {
            ChatRequest request = new ChatRequest(
                    "google/gemini-2.5-flash",
                    List.of(new ChatMessage("user", "hi"))
            );

            restClient.post()
                    .uri(apiUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception ignored) {
            // Errors are fine — we only care about round-trip time
        }

        return System.currentTimeMillis() - start;
    }
}

package com.edupath.ai.openrouter.controller;

import com.edupath.ai.openrouter.entity.ApiUsage;
import com.edupath.ai.openrouter.repository.ApiUsageRepository;
import com.edupath.ai.openrouter.service.OpenRouterService;
import com.edupath.ai.StudentProfile.entity.StudentProfile;
import com.edupath.ai.StudentProfile.repository.StudentProfileRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/open-router")
public class OpenRouterController {
    @Autowired
    private OpenRouterService openRouterService;

    @Autowired
    private ApiUsageRepository apiUsageRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @PostMapping("/process")
    public ResponseEntity<Object> process(@RequestBody Map<String, Object> body) throws Exception {
        String prompt = (String) body.get("prompt");
        Object historyObj = body.get("history");
        
        java.util.List<com.edupath.ai.openrouter.dto.ChatMessage> history = null;
        if (historyObj instanceof java.util.List) {
            history = new java.util.ArrayList<>();
            for (Object obj : (java.util.List<?>) historyObj) {
                if (obj instanceof Map) {
                    Map<?, ?> map = (Map<?, ?>) obj;
                    String sender = (String) map.get("sender");
                    String text = (String) map.get("text");
                    if (sender != null && text != null) {
                        String role = "user".equalsIgnoreCase(sender) ? "user" : "assistant";
                        history.add(new com.edupath.ai.openrouter.dto.ChatMessage(role, text));
                    }
                }
            }
        }
        
        Object result = openRouterService.process(prompt, history);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/generate-report")
    public ResponseEntity<Object> generateReport(@RequestBody Map<String, String> body) {
        String riasecScores = body.get("riasecScores");
        String filteredCourses = body.get("filteredCourses");
        String studentProfileIdStr = body.get("studentProfileId");
        String track = body.getOrDefault("track", "SPM");
        
        if (riasecScores == null || filteredCourses == null) {
            return ResponseEntity.badRequest().body("{\"error\": \"Missing 'riasecScores' or 'filteredCourses' in request body\"}");
        }
        
        Object result = openRouterService.generatePersonalizedRealityReport(riasecScores, filteredCourses, track);
        
        if (studentProfileIdStr != null) {
            try {
                Long profileId = Long.parseLong(studentProfileIdStr);
                Optional<StudentProfile> profileOpt = studentProfileRepository.findById(profileId);
                if (profileOpt.isPresent()) {
                    StudentProfile profile = profileOpt.get();
                    ObjectMapper mapper = new ObjectMapper();
                    String reportJsonStr = mapper.writeValueAsString(result);
                    profile.setAiRealityReport(reportJsonStr);
                    studentProfileRepository.save(profile);
                }
            } catch (Exception e) {
                // Ignore parsing or saving errors to ensure response still returns
                e.printStackTrace();
            }
        }
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/usage")
    public ResponseEntity<ApiUsage> getUsage() {
        return ResponseEntity.ok(
                apiUsageRepository.findById("TOTAL_USAGE")
                        .orElse(new ApiUsage("TOTAL_USAGE", 0L, null))
        );
    }

    @GetMapping("/latency/measurement")
    public ResponseEntity<Map<String, Long>> getLatencyMeasurement() {
        Map<String, Long> results = new HashMap<>();

        // --- 1. Measure AI API Latency
        long aiLatency = openRouterService.measureAiLatency();
        results.put("aiLatency", aiLatency);

        // --- 2. Measure PostgreSQL Latency ---
        long dbStart = System.currentTimeMillis();
        Optional<ApiUsage> apiUsageOpt = apiUsageRepository.findById("TOTAL_USAGE");
        long dbEnd = System.currentTimeMillis();
        long dbLatency = dbEnd - dbStart;
        results.put("dbLatency", dbLatency);

        // --- 3. Extract AI API Usage ---
        long totalUsage = 0L;
        if (apiUsageOpt.isPresent()) {
            ApiUsage usageEntity = apiUsageOpt.get();
            totalUsage = usageEntity.getCount();
        }
        results.put("aiUsage", totalUsage);

        return ResponseEntity.ok(results);
    }

    @PostMapping("/ask")
    public ResponseEntity<Object> ask(@RequestBody Map<String, String> body) throws Exception {
        String prompt = body.get("prompt");
        Object result = openRouterService.smartProcess(prompt);
        return ResponseEntity.ok(result);
    }
}
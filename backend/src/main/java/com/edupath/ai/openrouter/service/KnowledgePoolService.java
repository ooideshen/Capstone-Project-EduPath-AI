package com.edupath.ai.openrouter.service;

import com.edupath.ai.career.entity.Career;
import com.edupath.ai.career.repository.CareerRepository;
import com.edupath.ai.courses.entity.Courses;
import com.edupath.ai.courses.repository.CourseRepository;
import com.edupath.ai.university.entity.University;
import com.edupath.ai.university.repository.UniversityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class KnowledgePoolService {

    @Autowired
    private CourseRepository coursesRepository;

    @Autowired
    private UniversityRepository universityRepository;

    @Autowired
    private CareerRepository careerRepository;

    public String injectUniversities(String userPrompt) {
        List<University> universities = universityRepository.findAll();

        String universityContext = universities.stream()
                .map(u -> "- " + u.getName() + " (" + u.getAddress() + ")")
                .collect(Collectors.joining("\n"));

        return String.format("""
                You have access to this knowledge pool:
                
                UNIVERSITIES:
                %s
                
                USER QUESTION: %s
                
                Answer based only on the knowledge pool above. If information isn't in the pool, say so.""",
                universityContext,
                userPrompt);
    }

    public String injectUniversitiesAndCourses(String userPrompt) {
        List<University> universities = universityRepository.findAll();
        List<Courses> courses = coursesRepository.findAll();

        String universityContext = universities.stream()
                .map(u -> "- " + u.getName() + " (" + u.getAddress() + ")")
                .collect(Collectors.joining("\n"));

        String courseContext = courses.stream()
                .map(c -> "- " + c.getCourseName() + " [" + c.getRiasecCategory() + "] @ " + c.getUniversity().getName())
                .collect(Collectors.joining("\n"));

        String result = String.format("""
                KNOWLEDGE POOL:
                
                UNIVERSITIES:
                %s
                
                COURSES:
                %s
                
                USER QUESTION: %s
                
                Answer based on the knowledge pool.""",
                universityContext,
                courseContext,
                userPrompt);

        return result;
    }

    public String injectAllData(String userPrompt) {
        List<University> universities = universityRepository.findAll();
        List<Courses> courses = coursesRepository.findAll();
        List<Career> careers = careerRepository.findAll();

        String universityContext = universities.stream()
                .map(u -> "- " + u.getName() + " (" + u.getAddress() + ")")
                .collect(Collectors.joining("\n"));

        String courseContext = courses.stream()
                .map(c -> "- " + c.getCourseName() + " [" + c.getRiasecCategory() + "] @ " + c.getUniversity().getName())
                .collect(Collectors.joining("\n"));

        String careerContext = careers.stream()
                .map(c -> "- " + c.getName() + " (Salary: " + c.getSalary() + ", Risk Level: " + c.getRisk() + "%)")
                .collect(Collectors.joining("\n"));

        return String.format("""
                KNOWLEDGE POOL:
                
                UNIVERSITIES:
                %s
                
                COURSES:
                %s
                
                CAREERS & JOBS:
                %s
                
                USER QUESTION: %s
                
                Answer based strictly on the knowledge pool provided above. If the user asks about careers, universities, or courses, use the data above to answer accurately.""",
                universityContext,
                courseContext,
                careerContext,
                userPrompt);
    }
}

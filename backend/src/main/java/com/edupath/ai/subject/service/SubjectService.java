package com.edupath.ai.subject.service;

import com.edupath.ai.courses.dto.CourseUpdateRequest;
import com.edupath.ai.courses.entity.Courses;
import com.edupath.ai.courses.repository.CourseRepository;
import com.edupath.ai.subject.dto.SubjectRequest;
import com.edupath.ai.subject.entity.Subject;
import com.edupath.ai.subject.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SubjectService {
    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Transactional
    public List<Subject> updateFullCourseInfo(Long courseId, CourseUpdateRequest request) {

        Courses course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setCourseName(request.getCourseName());
        course.setRiasecCategory(request.getRiasecCategory());

        if (course.getSubject() != null) {
            course.getSubject().clear();
        } else {
            course.setSubject(new java.util.ArrayList<>());
        }

        if (request.getSubjects() != null) {
            for (SubjectRequest subReq : request.getSubjects()) {
                Subject newSub = new Subject();
                newSub.setCourses(course);
                newSub.setName(subReq.getName());
                newSub.setGrade(subReq.getGrade());
                newSub.setTrack(subReq.getTrack() != null ? subReq.getTrack() : "SPM");
                course.getSubject().add(newSub);
            }
        }
        courseRepository.save(course);

        return course.getSubject();
    }

    @Transactional
    public void deleteCourseAndSubjects(Long courseId) {

        Courses course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));

        courseRepository.delete(course);
    }
}

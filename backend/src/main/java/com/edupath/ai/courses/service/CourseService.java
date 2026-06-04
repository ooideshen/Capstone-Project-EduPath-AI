package com.edupath.ai.courses.service;

import com.edupath.ai.courses.dto.CourseRequest;
import com.edupath.ai.courses.entity.Courses;
import com.edupath.ai.courses.repository.CourseRepository;
import com.edupath.ai.subject.dto.SubjectRequest;
import com.edupath.ai.subject.entity.Subject;
import com.edupath.ai.university.entity.University;
import com.edupath.ai.university.repository.UniversityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UniversityRepository universityRepository;

    @Transactional
    public Courses add(CourseRequest request) {
        Courses course = new Courses();

        Long uniId = request.getUniversityId();

        University university = universityRepository.findById(uniId)
                .orElseThrow(() -> new RuntimeException("University not found with id: " + uniId));

        course.setUniversity(university);
        course.setCourseName(request.getCourseName());
        course.setRiasecCategory(request.getRiasecCategory());

        List<Subject> subjectList = new ArrayList<>();
        if (request.getSubjects() != null && !request.getSubjects().isEmpty()) {
            for (SubjectRequest subReq : request.getSubjects()) {
                Subject subject = new Subject();
                subject.setName(subReq.getName());
                subject.setGrade(subReq.getGrade());
                subject.setTrack(subReq.getTrack() != null ? subReq.getTrack() : "SPM");
                subject.setCourses(course);
                subjectList.add(subject);
            }
        }

        course.setSubject(subjectList);

        return courseRepository.save(course);
    }

    public List<Courses> getAllCourses() {
        return courseRepository.findAllByOrderByIdDesc();
    }
}




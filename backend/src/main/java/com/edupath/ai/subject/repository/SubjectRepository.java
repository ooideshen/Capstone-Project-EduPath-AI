package com.edupath.ai.subject.repository;

import com.edupath.ai.subject.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Long> {

    //Science course filter 1.3.1
    @Query(value = "select academic_assessment.mathematic_grade \"MQA mathematic grade\", university.name \"University name\", courses.course_name \"Course name\", subject.name || ' ' || subject.grade \"Requirement\" " +
            "from academic_assessment, student_profile, student_pathway, pathway, university_pathway, university, courses,subject " +
            "where academic_assessment.academic_assessmentid = student_profile.student_profileid " +
            "and " +
            "student_profile.student_profileid = student_pathway.id " +
            "and " +
            "student_pathway.id= pathway.pathwayid " +
            "and " +
            "pathway.pathwayid = university_pathway.id " +
            "and " +
            "university_pathway.id = university.id " +
            "and " +
            "university.id = courses.id " +
            "and " +
            "courses.id = subject.id " +
            "and " +
            "academic_assessment.mathematic_grade='A' " +
            "and " +
            "subject.name ILIKE '%mathematic%';",
            nativeQuery = true)
    List<Subject> findByAcademicAssessmentmathematicGrade(String mathematicGrade);

    //Art course filter 1.3.1
    @Query(value = "select academic_assessment.art_grade \"MQA art grade\", university.name \"University name\", courses.course_name \"Course name\", subject.name || ' ' || subject.grade \"Requirement\" " +
            "from academic_assessment, student_profile, student_pathway, pathway, university_pathway, university, courses,subject " +
            "where academic_assessment.academic_assessmentid = student_profile.student_profileid " +
            "and " +
            "student_profile.student_profileid = student_pathway.id " +
            "and " +
            "student_pathway.id= pathway.pathwayid " +
            "and " +
            "pathway.pathwayid = university_pathway.id " +
            "and " +
            "university_pathway.id = university.id " +
            "and " +
            "university.id = courses.id " +
            "and " +
            "courses.id = subject.id " +
            "and " +
            "academic_assessment.art_grade='A' " +
            "and " +
            "subject.name ILIKE '%art%';",
            nativeQuery = true)
    List<Subject> findByAcademicAssessmentartGrade(String artGrade);

    //Science course filter 3.2.3
    @Query(value = "select courses.course_name \"Course name\", subject.name || ' ' || subject.grade \"Requirement\" , academic_assessment.mathematic_grade \"MQA mathematic grade\" " +
            "from academic_assessment, student_profile, student_pathway, pathway, university_pathway, university, courses,subject " +
            "where academic_assessment.academic_assessmentid = student_profile.student_profileid " +
            "and " +
            "student_profile.student_profileid = student_pathway.id " +
            "and " +
            "student_pathway.id= pathway.pathwayid " +
            "and " +
            "pathway.pathwayid = university_pathway.id " +
            "and " +
            "university_pathway.id = university.id " +
            "and " +
            "university.id = courses.id " +
            "and " +
            "courses.id = subject.id " +
            "and " +
            "academic_assessment.mathematic_grade='A' " +
            "and " +
            "subject.name ILIKE '%mathematic%';",
            nativeQuery = true)
    List<Subject> findByAcademicAssessmentmathematicGradeRule(String mathematicGrade);

    //Art course filter 3.2.3
    @Query(value = "select courses.course_name \"Course name\", subject.name || ' ' || subject.grade \"Requirement\" , academic_assessment.mathematic_grade \"MQA art grade\" " +
            "from academic_assessment, student_profile, student_pathway, pathway, university_pathway, university, courses,subject " +
            "where academic_assessment.academic_assessmentid = student_profile.student_profileid " +
            "and " +
            "student_profile.student_profileid = student_pathway.id " +
            "and " +
            "student_pathway.id= pathway.pathwayid " +
            "and " +
            "pathway.pathwayid = university_pathway.id " +
            "and " +
            "university_pathway.id = university.id " +
            "and " +
            "university.id = courses.id " +
            "and " +
            "courses.id = subject.id " +
            "and " +
            "academic_assessment.art_grade='A' " +
            "and " +
            "subject.name ILIKE '%art%';",
            nativeQuery = true)
    List<Subject> findByAcademicAssessmentartGradeRule(String artGrade);
}

package com.edupath.ai.CounselorProfile.service;

import com.edupath.ai.CounselorProfile.dto.CounselorProfileRequest;
import com.edupath.ai.CounselorProfile.entity.CounselorProfile;
import com.edupath.ai.CounselorProfile.repository.CounselorProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CounselorProfileService {
    @Autowired
    private CounselorProfileRepository counselorProfileRepository;

    public CounselorProfile add(CounselorProfileRequest request) {
        CounselorProfile counselorProfile = new CounselorProfile();
        counselorProfile.setGender(request.getGender());
        counselorProfile.setCertificate(request.getCertificate());
        counselorProfile.setDescription(request.getDescription());
        counselorProfile = counselorProfileRepository.save(counselorProfile);

        return counselorProfile;
    }
}




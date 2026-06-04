package com.edupath.ai.AdminProfile.service;

import com.edupath.ai.AdminProfile.dto.AdminProfileRequest;
import com.edupath.ai.AdminProfile.entity.AdminProfile;
import com.edupath.ai.AdminProfile.repository.AdminProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminProfileService {
    @Autowired
    private AdminProfileRepository adminProfileRepository;

    public AdminProfile add(AdminProfileRequest request) {
        AdminProfile adminProfile = new AdminProfile();
        adminProfile.setGender(request.getGender());
        adminProfile.setDescription(request.getDescription());
//        adminProfile.setUsers(request.getUsers());
        adminProfile = adminProfileRepository.save(adminProfile);

        return adminProfile;
    }
}










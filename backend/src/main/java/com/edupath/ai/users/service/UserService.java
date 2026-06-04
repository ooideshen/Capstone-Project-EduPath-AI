package com.edupath.ai.users.service;

import com.edupath.ai.users.dto.UserRequest;
import com.edupath.ai.users.entity.Users;
import com.edupath.ai.users.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UsersRepository usersRepository;

    public List<Users> getAllUsers() {
        return usersRepository.findAllByOrderByIdDesc();
    }

    public Users getUserById(Long id) {
        return usersRepository.findById(id).orElse(null);
    }

    public Users update(Long id, UserRequest request) {
        return usersRepository.findById(id).map(user -> {
            if (request.getRole() != null) {
                user.setRole(request.getRole());
            }
            if (request.getStatus() != null) {
                user.setStatus(request.getStatus());
            }
            return usersRepository.save(user);
        }).orElse(null);
    }
}

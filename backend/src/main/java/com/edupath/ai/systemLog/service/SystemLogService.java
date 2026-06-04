package com.edupath.ai.systemLog.service;

import com.edupath.ai.systemLog.entity.SystemLog;
import com.edupath.ai.systemLog.repository.SystemLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SystemLogService {

    @Autowired
    private SystemLogRepository systemLogRepository;

    public List<SystemLog> getAllSystemLogs() {
        return systemLogRepository.findAll(Sort.by(Sort.Direction.DESC, "timestamp"));
    }

    public void createLog(String level, String message) {
        SystemLog log = new SystemLog();
        log.setLevel(level);
        log.setMessage(message);
        log.setTimestamp(LocalDateTime.now());

        systemLogRepository.save(log);
    }
}
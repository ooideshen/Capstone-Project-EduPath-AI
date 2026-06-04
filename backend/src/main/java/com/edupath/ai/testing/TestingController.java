package com.edupath.ai.testing;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/testing")
public class TestingController {

    @GetMapping("/hello-world")     // GET /api/users/1
    public String getHelloWorld() {
        return "hello world";
    }

    @GetMapping("/hello-world2")     // GET /api/users/1
    public String getHelloWorld2() {
        return "hello world2";
    }
}

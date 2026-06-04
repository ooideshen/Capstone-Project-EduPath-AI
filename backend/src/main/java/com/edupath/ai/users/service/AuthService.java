package com.edupath.ai.users.service;

import com.edupath.ai.systemLog.service.SystemLogService;
import com.edupath.ai.users.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.edupath.ai.users.entity.Users;
import com.edupath.ai.users.repository.UsersRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
import javax.crypto.SecretKey;

@Service
public class AuthService {

    @Autowired
    private UsersRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SystemLogService systemLogService;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @Value("${jwt.refresh-expiration}")
    private long refreshTokenExpiration;

    public SignUpResponse signup(SignUpRequest request) {
        // Validate input
        if (request.getName() == null || request.getName().isEmpty()) {
            return new SignUpResponse(false, "Username is required");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return new SignUpResponse(false, "Password is required");
        }

        // Check if user already exists
        if (userRepository.existsByName(request.getName())) {
            systemLogService.createLog("WARN", "Registration failed. Username already taken: '" + request.getName() + "'.");
            return new SignUpResponse(false, "Username already taken");
        }

        try {
            // Create new user
            Users user = new Users();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword())); // Hash the password with salt
            user.setRole("STUDENT");
            user.setStatus("ACTIVE"); // Set default status
            // Save to database
            userRepository.save(user);

            String successMessage = "New user registered successfully. Username: '" + user.getName() + "', Role: " + user.getRole() + ".";
            systemLogService.createLog("INFO", successMessage);

            SignUpResponse response = new SignUpResponse(true, "User registered successfully");

            return response;
        } catch (Exception e) {
            String errorMessage = "Critical error during user registration for '" + request.getName() + "': " + e.getMessage();
            systemLogService.createLog("ERROR", errorMessage);
            return new SignUpResponse(false, "An error occurred during registration: " + e.getMessage());
        }
    }

    public LoginResponse login(LoginRequest request) {
        // Validate input
        if (request.getName() == null || request.getName().isEmpty()) {
            return new LoginResponse(false, "Username is required");
        }
        if (request.getPassword() == null || request.getPassword().isEmpty()) {
            return new LoginResponse(false, "Password is required");
        }

        try {
            // Find user by name
            Users user = userRepository.findByName(request.getName());

            if (user == null) {
                return new LoginResponse(false, "Username or password is incorrect");
            }

            // Verify password
            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return new LoginResponse(false, "Username or password is incorrect");
            }

            // Check if user is active
            if ("SUSPEND".equalsIgnoreCase(user.getStatus())) {
                return new LoginResponse(false, "Your account is currently suspended, so you cannot log in.");
            } else if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
                return new LoginResponse(false, "Your account is currently inactive. Please contact support.");
            }

            String accessToken = generateAccessToken(user);
            String refreshToken = generateRefreshToken(user);

            return new LoginResponse(
                    true,
                    "Login successful",
                    accessToken,
                    user.getId(),
                    user.getName(),
                    refreshToken,
                    jwtExpiration,
                    user.getRole()
            );

        } catch (Exception e) {
            systemLogService.createLog("ERROR", "Internal system error during login for '" + request.getName() + "': " + e.getMessage());
            return new LoginResponse(false, "An error occurred: " + e.getMessage());
        }
    }

    public RefreshTokenResponse refreshAccessToken(String refreshToken) {
        try {
            if (refreshToken == null || refreshToken.isEmpty()) {
                return new RefreshTokenResponse(false, "Refresh token is required");
            }

            Claims claims = getClaimsFromToken(refreshToken);

            if (claims.getExpiration().before(new Date())) {
                return new RefreshTokenResponse(false, "Refresh token has expired");
            }

            Long userId = Long.parseLong(claims.getSubject());

            Users user = userRepository.findById(userId).orElse(null);

            if (user == null || !"ACTIVE".equals(user.getStatus())) {
                systemLogService.createLog("WARN", "Token refresh blocked: User ID " + userId + " is either missing or inactive.");
                return new RefreshTokenResponse(false, "User not found or inactive");
            }

            String newAccessToken = generateAccessToken(user);

            return new RefreshTokenResponse(
                    true,
                    "Token refreshed successfully",
                    newAccessToken,
                    jwtExpiration
            );

        } catch (Exception e) {
            return new RefreshTokenResponse(false, "Failed to refresh token: " + e.getMessage());
        }
    }

    private String generateAccessToken(Users user) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .setSubject(user.getId().toString())
                .claim("username", user.getName())
                .claim("email", user.getEmail())
                .claim("role", user.getRole())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    private String generateRefreshToken(Users user) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshTokenExpiration);

        return Jwts.builder()
                .setSubject(user.getId().toString())
                .claim("type", "refresh")
                .claim("role", user.getRole())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    private Claims getClaimsFromToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}

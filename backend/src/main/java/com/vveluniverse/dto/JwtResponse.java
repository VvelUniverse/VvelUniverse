package com.vveluniverse.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String id;
    private String email;
    private String name;
    private Boolean isAdmin;

    public JwtResponse(String token, String id, String email, String name, Boolean isAdmin) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.name = name;
        this.isAdmin = isAdmin;
    }
}


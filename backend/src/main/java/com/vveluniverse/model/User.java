package com.vveluniverse.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    
    @Id
    private String id;
    
    private String name;
    
    @Indexed(unique = true)
    private String email;
    
    @Indexed(unique = true, sparse = true)
    private String mobile;
    
    private String password;
    
    private String provider = "local"; // local, google, instagram
    
    private String providerId;
    
    private String accountType = "user"; // user, client
    
    private Boolean isAdmin = false;
    
    private Set<String> adminPermissions = new HashSet<>();
    
    private String profilePhoto;
    
    private String bio;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}


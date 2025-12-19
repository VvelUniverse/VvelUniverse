package com.vveluniverse.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "connectrequests")
public class ConnectRequest {
    
    @Id
    private String id;
    
    // Requester details
    private String requesterId;
    private String requesterName;
    private String requesterEmail;
    
    // Influencer/Client details
    private String influencerId;
    private String influencerName;
    private String influencerEmail;
    
    // Session details
    private String sessionTitle = "Connection Session";
    private String sessionType = "video"; // video, audio
    private Integer durationMinutes = 30;
    private LocalDateTime scheduledTime;
    
    // Payment details
    private Double amount = 0.0;
    private String currency = "INR";
    
    // Status and workflow
    private String status = "pending"; // pending, approved, rejected, completed, cancelled
    
    // Admin actions
    private String approvedBy;
    private LocalDateTime approvedAt;
    private String rejectedBy;
    private LocalDateTime rejectedAt;
    private String rejectionReason;
    
    // Payment tracking
    private String paymentStatus = "pending"; // pending, paid, refunded
    private String paymentMethod;
    private LocalDateTime paymentDate;
    
    // Meeting details
    private String meetingCode;
    private String meetingUrl;
    
    // Additional information
    private String message;
    private String notes;
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}


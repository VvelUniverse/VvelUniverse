package com.vveluniverse.repository;

import com.vveluniverse.model.ConnectRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConnectRequestRepository extends MongoRepository<ConnectRequest, String> {
    
    List<ConnectRequest> findByStatus(String status);
    
    List<ConnectRequest> findByRequesterId(String requesterId);
    
    List<ConnectRequest> findByInfluencerId(String influencerId);
    
    Long countByStatus(String status);
}


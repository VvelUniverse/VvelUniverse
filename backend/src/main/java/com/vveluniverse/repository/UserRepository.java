package com.vveluniverse.repository;

import com.vveluniverse.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByMobile(String mobile);
    
    Boolean existsByEmail(String email);
    
    Boolean existsByMobile(String mobile);
}


package com.vveluniverse.repository;

import com.vveluniverse.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    
    Optional<Category> findBySlug(String slug);
    
    List<Category> findByIsActive(Boolean isActive);
    
    List<Category> findAllByOrderByOrderAscNameAsc();
    
    Boolean existsBySlug(String slug);
}


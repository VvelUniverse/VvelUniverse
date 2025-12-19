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
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "categories")
public class Category {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String name;
    
    @Indexed(unique = true)
    private String slug;
    
    private String icon = "📁";
    
    private String description;
    
    private String color = "#6366f1";
    
    private Integer order = 0;
    
    private Boolean isActive = true;
    
    private List<Subcategory> subcategories = new ArrayList<>();
    
    @CreatedDate
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Subcategory {
        private String id;
        private String name;
        private String slug;
        private String icon = "📄";
        private String description;
        private Boolean isActive = true;
    }
}


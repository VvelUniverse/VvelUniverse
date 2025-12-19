package com.vveluniverse.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CategoryDTO {
    
    @NotBlank(message = "Category name is required")
    private String name;
    
    private String icon = "📁";
    
    private String description;
    
    private String color = "#6366f1";
    
    private Integer order = 0;
}


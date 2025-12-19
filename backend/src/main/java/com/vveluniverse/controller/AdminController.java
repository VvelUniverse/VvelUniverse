package com.vveluniverse.controller;

import com.vveluniverse.dto.ApiResponse;
import com.vveluniverse.dto.CategoryDTO;
import com.vveluniverse.model.Category;
import com.vveluniverse.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private CategoryService categoryService;

    // Get all categories (including inactive)
    @GetMapping("/categories")
    public ResponseEntity<?> getAllCategories() {
        try {
            List<Category> categories = categoryService.getAllCategories();
            return ResponseEntity.ok(new ApiResponse(true, "Categories retrieved successfully", categories));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error retrieving categories: " + e.getMessage()));
        }
    }

    // Create new category
    @PostMapping("/categories")
    public ResponseEntity<?> createCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        try {
            Category category = categoryService.createCategory(categoryDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Category created successfully", category));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error creating category: " + e.getMessage()));
        }
    }

    // Update category
    @PutMapping("/categories/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable String id, @Valid @RequestBody CategoryDTO categoryDTO) {
        try {
            Category category = categoryService.updateCategory(id, categoryDTO);
            return ResponseEntity.ok(new ApiResponse(true, "Category updated successfully", category));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error updating category: " + e.getMessage()));
        }
    }

    // Delete category
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable String id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok(new ApiResponse(true, "Category deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error deleting category: " + e.getMessage()));
        }
    }

    // Toggle category status
    @PutMapping("/categories/{id}/toggle")
    public ResponseEntity<?> toggleCategoryStatus(@PathVariable String id) {
        try {
            Category category = categoryService.toggleCategoryStatus(id);
            return ResponseEntity.ok(new ApiResponse(true, "Category status toggled successfully", category));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Error toggling category status: " + e.getMessage()));
        }
    }
}

package com.vveluniverse.controller;

import com.vveluniverse.dto.ApiResponse;
import com.vveluniverse.dto.CategoryDTO;
import com.vveluniverse.model.Category;
import com.vveluniverse.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<?> getAllCategories(@RequestParam(required = false) Boolean active) {
        try {
            List<Category> categories;
            if (Boolean.TRUE.equals(active)) {
                categories = categoryService.getActiveCategories();
            } else {
                categories = categoryService.getAllCategories();
            }
            return ResponseEntity.ok(new ApiResponse(true, "Categories fetched successfully", categories));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Failed to fetch categories"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable String id) {
        try {
            Category category = categoryService.getCategoryById(id);
            return ResponseEntity.ok(new ApiResponse(true, "Category fetched successfully", category));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        try {
            Category category = categoryService.createCategory(categoryDTO);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Category created successfully", category));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCategory(@PathVariable String id, @RequestBody CategoryDTO categoryDTO) {
        try {
            Category category = categoryService.updateCategory(id, categoryDTO);
            return ResponseEntity.ok(new ApiResponse(true, "Category updated successfully", category));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCategory(@PathVariable String id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok(new ApiResponse(true, "Category deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PutMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toggleCategoryStatus(@PathVariable String id) {
        try {
            Category category = categoryService.toggleCategoryStatus(id);
            return ResponseEntity.ok(new ApiResponse(true, "Category status updated", category));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}


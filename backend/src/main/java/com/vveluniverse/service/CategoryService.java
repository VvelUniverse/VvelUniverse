package com.vveluniverse.service;

import com.vveluniverse.dto.CategoryDTO;
import com.vveluniverse.model.Category;
import com.vveluniverse.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAllByOrderByOrderAscNameAsc();
    }

    public List<Category> getActiveCategories() {
        return categoryRepository.findByIsActive(true);
    }

    public Category getCategoryById(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    public Category createCategory(CategoryDTO categoryDTO) {
        // Generate slug from name
        String slug = generateSlug(categoryDTO.getName());

        // Check if slug already exists
        if (categoryRepository.existsBySlug(slug)) {
            throw new RuntimeException("Category with this name already exists");
        }

        Category category = new Category();
        category.setName(categoryDTO.getName());
        category.setSlug(slug);
        category.setIcon(categoryDTO.getIcon());
        category.setDescription(categoryDTO.getDescription());
        category.setColor(categoryDTO.getColor());
        category.setOrder(categoryDTO.getOrder());

        return categoryRepository.save(category);
    }

    public Category updateCategory(String id, CategoryDTO categoryDTO) {
        Category category = getCategoryById(id);

        if (categoryDTO.getName() != null) {
            category.setName(categoryDTO.getName());
            category.setSlug(generateSlug(categoryDTO.getName()));
        }
        if (categoryDTO.getIcon() != null) {
            category.setIcon(categoryDTO.getIcon());
        }
        if (categoryDTO.getDescription() != null) {
            category.setDescription(categoryDTO.getDescription());
        }
        if (categoryDTO.getColor() != null) {
            category.setColor(categoryDTO.getColor());
        }
        if (categoryDTO.getOrder() != null) {
            category.setOrder(categoryDTO.getOrder());
        }

        return categoryRepository.save(category);
    }

    public void deleteCategory(String id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }

    public Category toggleCategoryStatus(String id) {
        Category category = getCategoryById(id);
        category.setIsActive(!category.getIsActive());
        return categoryRepository.save(category);
    }

    private String generateSlug(String name) {
        return name.toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+|-+$", "");
    }
}


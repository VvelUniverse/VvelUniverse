package com.vveluniverse.controller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@Controller
public class PageController {

    private static final String FRONTEND_BASE = "../frontend/pages/";
    private static final String IMAGES_BASE = "../frontend/public/assets/images/";

    // Root - serve login page
    @GetMapping("/")
    public String index() {
        return "forward:/pages/auth/index.html";
    }

    // Login and register shortcuts
    @GetMapping("/login")
    public String login() {
        return "forward:/pages/auth/index.html";
    }

    @GetMapping("/register")
    public String register() {
        return "forward:/pages/auth/register.html";
    }

    // Profile page
    @GetMapping("/profile")
    public String profile() {
        return "forward:/pages/profile/profile.html";
    }

    // Categories page
    @GetMapping("/categories")
    public String categories() {
        return "forward:/pages/categories/categories.html";
    }

    // Admin pages
    @GetMapping("/admin")
    public String admin() {
        return "forward:/pages/admin/admin.html";
    }

    @GetMapping("/vveladmins")
    public String adminLogin() {
        return "forward:/pages/auth/admin-login.html";
    }

    // Category home pages
    @GetMapping("/business")
    public String business() {
        return "forward:/pages/categories/business/business-home.html";
    }

    @GetMapping("/cinema")
    public String cinema() {
        return "forward:/pages/categories/cinema/cinema-home.html";
    }

    @GetMapping("/education")
    public String education() {
        return "forward:/pages/categories/education/education-home.html";
    }

    @GetMapping("/influencers")
    public String influencers() {
        return "forward:/pages/categories/influencers/influencers-home.html";
    }

    @GetMapping("/law")
    public String law() {
        return "forward:/pages/categories/law/law-home.html";
    }

    @GetMapping("/medical")
    public String medical() {
        return "forward:/pages/categories/medical/medical-home.html";
    }

    @GetMapping("/politics")
    public String politics() {
        return "forward:/pages/categories/politics/politics-home.html";
    }

    @GetMapping("/science")
    public String science() {
        return "forward:/pages/categories/science/science-home.html";
    }

    @GetMapping("/sports")
    public String sports() {
        return "forward:/pages/categories/sports/sports-home.html";
    }

    @GetMapping("/spiritual")
    public String spiritual() {
        return "forward:/pages/spiritual/spiritual.html";
    }

    // Background image aliases (handle all variations)
    @GetMapping({
        "/space-bg.png", "/Space-bg.png",
        "/space-bg.jpg", "/Space-bg.jpg",
        "/space-bg.jpeg", "/Space-bg.jpeg",
        "/assets/images/space-bg.png", "/assets/images/Space-bg.png",
        "/assets/images/space-bg.jpg", "/assets/images/Space-bg.jpg",
        "/assets/images/space-bg.jpeg", "/assets/images/Space-bg.jpeg"
    })
    public ResponseEntity<Resource> getBackgroundImage() {
        File imageFile = new File(IMAGES_BASE + "Space-bg.jpg");
        if (!imageFile.exists()) {
            imageFile = new File(IMAGES_BASE + "Space-bg-2.jpg");
        }
        
        Resource resource = new FileSystemResource(imageFile);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_JPEG_VALUE)
                .body(resource);
    }

    // Favicon
    @GetMapping("/favicon.ico")
    public ResponseEntity<Resource> getFavicon() {
        File faviconFile = new File(IMAGES_BASE + "vvel-logo.png");
        Resource resource = new FileSystemResource(faviconFile);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.IMAGE_PNG_VALUE)
                .body(resource);
    }

    // Category sub-pages (e.g., /sports-alerts, /medical-community)
    @GetMapping("/{category}-{page}")
    public String categoryPage(@PathVariable String category, @PathVariable String page) {
        String[] validCategories = {"business", "cinema", "education", "influencers", "law", "medical", "politics", "science", "sports"};
        String[] validPages = {"home", "alerts", "celebrations", "community", "search", "wallet"};
        
        for (String cat : validCategories) {
            if (category.equals(cat)) {
                for (String p : validPages) {
                    if (page.equals(p)) {
                        return "forward:/pages/categories/" + category + "/" + category + "-" + page + ".html";
                    }
                }
            }
        }
        
        return "forward:/pages/auth/index.html";
    }
}

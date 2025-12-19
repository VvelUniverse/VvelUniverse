package com.vveluniverse.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.File;
import java.io.IOException;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Get the absolute path to frontend folder (one level up from backend)
        String frontendPath = new File("../frontend/").getAbsolutePath() + File.separator;
        
        // Serve frontend pages
        registry.addResourceHandler("/pages/**")
                .addResourceLocations("file:" + frontendPath + "pages/")
                .setCachePeriod(0);
        
        // Serve frontend scripts
        registry.addResourceHandler("/scripts/**")
                .addResourceLocations("file:" + frontendPath + "scripts/")
                .setCachePeriod(0);
        
        // Serve frontend styles
        registry.addResourceHandler("/styles/**")
                .addResourceLocations("file:" + frontendPath + "styles/")
                .setCachePeriod(0);
        
        // Serve public assets (images, etc.)
        registry.addResourceHandler("/public/**")
                .addResourceLocations("file:" + frontendPath + "public/")
                .setCachePeriod(0);
        
        // Direct access to assets folder
        registry.addResourceHandler("/assets/**")
                .addResourceLocations("file:" + frontendPath + "public/assets/")
                .setCachePeriod(0);
                
        // Serve data files
        registry.addResourceHandler("/data/**")
                .addResourceLocations("file:" + frontendPath + "data/")
                .setCachePeriod(0);
                
        // Serve uploads (one level up from backend)
        String uploadsPath = new File("../uploads/").getAbsolutePath() + File.separator;
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadsPath)
                .setCachePeriod(0);
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Root path redirects to login
        registry.addViewController("/").setViewName("forward:/pages/auth/index.html");
    }
}

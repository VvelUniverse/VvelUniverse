package com.vveluniverse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class VvelUniverseApplication {

    public static void main(String[] args) {
        SpringApplication.run(VvelUniverseApplication.class, args);
    }
}


package com.githubcollections.controller;

import com.githubcollections.service.GithubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/github")
@RequiredArgsConstructor
public class GithubController {

    private final GithubService githubService;

    // type = all | users | repositories
    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String q,
                                     @RequestParam(defaultValue = "all") String type,
                                     @RequestParam(defaultValue = "1") int page,
                                     @RequestParam(defaultValue = "12") int perPage) {
        if (type.equalsIgnoreCase("users")) {
            return jsonBody(githubService.searchUsers(q, page, perPage));
        } else if (type.equalsIgnoreCase("repositories")) {
            return jsonBody(githubService.searchRepositories(q, page, perPage));
        } else {
            // "all" -> return both under one object
            String users = githubService.searchUsers(q, page, 6);
            String repos = githubService.searchRepositories(q, page, 6);
            String combined = "{\"users\":" + users + ",\"repositories\":" + repos + "}";
            return jsonBody(combined);
        }
    }

    @GetMapping("/users/{username}")
    public ResponseEntity<?> getUser(@PathVariable String username) {
        return jsonBody(githubService.getUserProfile(username));
    }

    @GetMapping("/repos/{owner}/{repo}")
    public ResponseEntity<?> getRepo(@PathVariable String owner, @PathVariable String repo) {
        return jsonBody(githubService.getRepository(owner, repo));
    }

    private ResponseEntity<?> jsonBody(String body) {
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(body);
    }
}

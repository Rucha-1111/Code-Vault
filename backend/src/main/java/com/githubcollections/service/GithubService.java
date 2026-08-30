package com.githubcollections.service;

import com.githubcollections.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class GithubService {

    private final RestTemplate restTemplate;

    @Value("${github.api.base-url}")
    private String baseUrl;

    @Value("${github.api.token:}")
    private String token;

    public GithubService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private HttpEntity<Void> buildEntity() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Accept", "application/vnd.github+json");
        if (token != null && !token.isBlank()) {
            headers.set("Authorization", "Bearer " + token);
        }
        return new HttpEntity<>(headers);
    }

    private String call(String url) {
        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, buildEntity(), String.class);
            return response.getBody();
        } catch (HttpClientErrorException.NotFound e) {
            throw new ApiException("Not found on GitHub", HttpStatus.NOT_FOUND);
        } catch (HttpClientErrorException.Forbidden e) {
            throw new ApiException("GitHub API rate limit exceeded. Try again later or add a token.", HttpStatus.TOO_MANY_REQUESTS);
        } catch (HttpClientErrorException e) {
            throw new ApiException("GitHub API error: " + e.getMessage(), HttpStatus.BAD_GATEWAY);
        }
    }

    public String searchUsers(String query, int page, int perPage) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/search/users")
                .queryParam("q", query)
                .queryParam("page", page)
                .queryParam("per_page", perPage)
                .toUriString();
        return call(url);
    }

    public String searchRepositories(String query, int page, int perPage) {
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl + "/search/repositories")
                .queryParam("q", query)
                .queryParam("page", page)
                .queryParam("per_page", perPage)
                .toUriString();
        return call(url);
    }

    public String getUserProfile(String username) {
        return call(baseUrl + "/users/" + username);
    }

    public String getRepository(String owner, String repo) {
        return call(baseUrl + "/repos/" + owner + "/" + repo);
    }
}

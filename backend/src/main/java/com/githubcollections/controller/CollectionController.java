package com.githubcollections.controller;

import com.githubcollections.dto.CollectionRequest;
import com.githubcollections.dto.CollectionResponse;
import com.githubcollections.dto.SavedItemRequest;
import com.githubcollections.dto.SavedItemResponse;
import com.githubcollections.service.CollectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collections")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService collectionService;

    @GetMapping
    public ResponseEntity<List<CollectionResponse>> getMyCollections() {
        return ResponseEntity.ok(collectionService.getMyCollections());
    }

    @PostMapping
    public ResponseEntity<CollectionResponse> create(@Valid @RequestBody CollectionRequest request) {
        return ResponseEntity.ok(collectionService.createCollection(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CollectionResponse> rename(@PathVariable Long id, @Valid @RequestBody CollectionRequest request) {
        return ResponseEntity.ok(collectionService.renameCollection(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        collectionService.deleteCollection(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/items")
    public ResponseEntity<List<SavedItemResponse>> getItems(@PathVariable Long id) {
        return ResponseEntity.ok(collectionService.getItems(id));
    }

    @PostMapping("/{id}/items")
    public ResponseEntity<SavedItemResponse> addItem(@PathVariable Long id, @Valid @RequestBody SavedItemRequest request) {
        return ResponseEntity.ok(collectionService.addItem(id, request));
    }

    @DeleteMapping("/{id}/items/{itemId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long id, @PathVariable Long itemId) {
        collectionService.removeItem(id, itemId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/recent")
    public ResponseEntity<List<SavedItemResponse>> recentlySaved() {
        return ResponseEntity.ok(collectionService.getRecentlySaved());
    }
}

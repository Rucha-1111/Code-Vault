package com.githubcollections.service;

import com.githubcollections.dto.CollectionRequest;
import com.githubcollections.dto.CollectionResponse;
import com.githubcollections.dto.SavedItemRequest;
import com.githubcollections.dto.SavedItemResponse;
import com.githubcollections.exception.ApiException;
import com.githubcollections.model.Collection;
import com.githubcollections.model.SavedItem;
import com.githubcollections.model.User;
import com.githubcollections.repository.CollectionRepository;
import com.githubcollections.repository.SavedItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CollectionService {

    private final CollectionRepository collectionRepository;
    private final SavedItemRepository savedItemRepository;
    private final CurrentUserService currentUserService;

    public List<CollectionResponse> getMyCollections() {
        User user = currentUserService.getCurrentUser();
        return collectionRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(c -> new CollectionResponse(
                        c.getId(), c.getName(), c.getIcon(),
                        savedItemRepository.countByCollection(c), c.getCreatedAt()))
                .toList();
    }

    public CollectionResponse createCollection(CollectionRequest request) {
        User user = currentUserService.getCurrentUser();
        Collection collection = new Collection();
        collection.setName(request.getName().trim());
        collection.setIcon((request.getIcon() == null || request.getIcon().isBlank()) ? "📁" : request.getIcon());
        collection.setUser(user);
        collectionRepository.save(collection);
        return new CollectionResponse(collection.getId(), collection.getName(), collection.getIcon(), 0, collection.getCreatedAt());
    }

    public CollectionResponse renameCollection(Long id, CollectionRequest request) {
        Collection collection = getOwnedCollection(id);
        collection.setName(request.getName().trim());
        if (request.getIcon() != null && !request.getIcon().isBlank()) {
            collection.setIcon(request.getIcon());
        }
        collectionRepository.save(collection);
        long count = savedItemRepository.countByCollection(collection);
        return new CollectionResponse(collection.getId(), collection.getName(), collection.getIcon(), count, collection.getCreatedAt());
    }

    public void deleteCollection(Long id) {
        Collection collection = getOwnedCollection(id);
        collectionRepository.delete(collection);
    }

    public List<SavedItemResponse> getItems(Long collectionId) {
        Collection collection = getOwnedCollection(collectionId);
        return savedItemRepository.findByCollectionOrderBySavedAtDesc(collection).stream()
                .map(this::toResponse)
                .toList();
    }

    public SavedItemResponse addItem(Long collectionId, SavedItemRequest request) {
        Collection collection = getOwnedCollection(collectionId);
        SavedItem item = new SavedItem();
        item.setCollection(collection);
        item.setItemType(request.getItemType());
        item.setTitle(request.getTitle());
        item.setSubtitle(request.getSubtitle());
        item.setAvatarUrl(request.getAvatarUrl());
        item.setHtmlUrl(request.getHtmlUrl());
        item.setMeta(request.getMeta());
        savedItemRepository.save(item);
        return toResponse(item);
    }

    public void removeItem(Long collectionId, Long itemId) {
        Collection collection = getOwnedCollection(collectionId);
        SavedItem item = savedItemRepository.findByIdAndCollection(itemId, collection)
                .orElseThrow(() -> new ApiException("Saved item not found", HttpStatus.NOT_FOUND));
        savedItemRepository.delete(item);
    }

    public List<SavedItemResponse> getRecentlySaved() {
        User user = currentUserService.getCurrentUser();
        return savedItemRepository.findTop10ByCollection_UserOrderBySavedAtDesc(user).stream()
                .map(this::toResponse)
                .toList();
    }

    private Collection getOwnedCollection(Long id) {
        User user = currentUserService.getCurrentUser();
        return collectionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ApiException("Collection not found", HttpStatus.NOT_FOUND));
    }

    private SavedItemResponse toResponse(SavedItem item) {
        return new SavedItemResponse(
                item.getId(), item.getItemType(), item.getTitle(), item.getSubtitle(),
                item.getAvatarUrl(), item.getHtmlUrl(), item.getMeta(), item.getSavedAt(),
                item.getCollection().getId(), item.getCollection().getName());
    }
}

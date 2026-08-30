package com.githubcollections.repository;

import com.githubcollections.model.Collection;
import com.githubcollections.model.SavedItem;
import com.githubcollections.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedItemRepository extends JpaRepository<SavedItem, Long> {
    List<SavedItem> findByCollectionOrderBySavedAtDesc(Collection collection);
    Optional<SavedItem> findByIdAndCollection(Long id, Collection collection);
    List<SavedItem> findTop10ByCollection_UserOrderBySavedAtDesc(User user);
    long countByCollection(Collection collection);
}

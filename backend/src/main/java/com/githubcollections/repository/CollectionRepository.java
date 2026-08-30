package com.githubcollections.repository;

import com.githubcollections.model.Collection;
import com.githubcollections.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CollectionRepository extends JpaRepository<Collection, Long> {
    List<Collection> findByUserOrderByCreatedAtDesc(User user);
    Optional<Collection> findByIdAndUser(Long id, User user);
}

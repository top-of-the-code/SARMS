package com.sarms.repository;

import com.sarms.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUserId(String userId);
    boolean existsByUserId(String userId);
    long countByRoleAndUserIdStartingWith(String role, String prefix);
    void deleteByRole(String role);
}

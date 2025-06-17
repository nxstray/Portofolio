package com.beingexiled.serverBlog.repository;

import com.beingexiled.serverBlog.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Custom query methods only (if needed)
}
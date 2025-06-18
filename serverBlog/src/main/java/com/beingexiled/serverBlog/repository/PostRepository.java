package com.beingexiled.serverBlog.repository;

import org.springframework.stereotype.Repository;
import com.beingexiled.serverBlog.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findAllByNameContainingIgnoreCase(String name);
    
}

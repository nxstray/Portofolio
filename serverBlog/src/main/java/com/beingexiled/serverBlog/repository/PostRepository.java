package com.beingexiled.serverBlog.repository;

import org.springframework.stereotype.Repository;
import com.beingexiled.serverBlog.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // Custom query methods can be defined here if needed
    // For example:
    // List<Post> findByPostedBy(String postedBy);
    // List<Post> findByTagsContaining(String tag);
    
}

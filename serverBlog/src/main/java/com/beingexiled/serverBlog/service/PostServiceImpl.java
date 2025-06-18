package com.beingexiled.serverBlog.service;

import com.beingexiled.serverBlog.entity.Post;
import com.beingexiled.serverBlog.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityNotFoundException;


import java.util.List;
import java.util.Date;
import java.util.Optional;

@Service
public class PostServiceImpl implements PostService {
    // Implement methods from PostService interface here
    @Autowired
    private PostRepository postRepository;

    public Post savePost(Post post) {
        post.setViewCount(0);
        post.setDate(new Date());

        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post getPostById(Long postId) {
       Optional<Post> optionalpost = postRepository.findById(postId);
       if (optionalpost.isPresent()) {
           Post post = optionalpost.get();
           post.setViewCount(post.getViewCount() + 1);
           return postRepository.save(post);
       } else {
           throw new EntityNotFoundException("Post not found for id: " + postId);
       }
    }

    public List<Post> searchByName(String name) {
        return postRepository.findAllByNameContainingIgnoreCase(name);
    }
}

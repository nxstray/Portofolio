package com.beingexiled.serverBlog.service;

import com.beingexiled.serverBlog.entity.Post;
import com.beingexiled.serverBlog.entity.User;
import com.beingexiled.serverBlog.repository.PostRepository;
import com.beingexiled.serverBlog.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityNotFoundException;

import java.util.List;
import java.util.Date;
import java.util.Optional;

@Service
public class PostServiceImpl implements PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;


    @Override
    public Post savePost(Post post) {
        post.setViewCount(0);
        post.setDate(new Date());

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));
        
        if (post.getUser() != null && !post.getUser().getEmail().equals(email)) {
            throw new SecurityException("You are not authorized to create this post.");
        }
        post.setUser(user);
        
        return postRepository.save(post);
    }

    @Override
    public Post uploadImage(Long postId, MultipartFile imageFile) {
        Post existingPost = getPostById(postId);

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!existingPost.getUser().getEmail().equals(email)) {
            throw new SecurityException("You are not authorized to upload image for this post.");
        }

        try {
            String filename = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            String uploadDir = "uploads/";
            java.nio.file.Path filePath = java.nio.file.Paths.get(uploadDir + filename);
            java.nio.file.Files.createDirectories(filePath.getParent());
            java.nio.file.Files.write(filePath, imageFile.getBytes());

            existingPost.setImg("/uploads/" + filename);
            return postRepository.save(existingPost);
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload image", e);
        }
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

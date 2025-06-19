package com.beingexiled.serverBlog.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;

import com.beingexiled.serverBlog.dto.PostDTO;
import com.beingexiled.serverBlog.dto.PostMapper;
import com.beingexiled.serverBlog.entity.Post;
import com.beingexiled.serverBlog.service.PostService;

import jakarta.persistence.EntityNotFoundException;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Post post) {
        try {
            Post createdPost = postService.savePost(post);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating post: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllPosts() {
        try {
            List<PostDTO> postDTOs = postService.getAllPosts()
                .stream()
                .map(PostMapper::toDTO)
                .toList();

            return ResponseEntity.ok(postDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{postId}")
    public ResponseEntity<?> getPostById(@PathVariable Long postId) {
        try {
            Post post = postService.getPostById(postId);
            return ResponseEntity.ok(PostMapper.toDTO(post));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found for id: " + postId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching post: " + e.getMessage());
        }
    }

    @GetMapping("/search/{name}")
    public ResponseEntity<?> searchByName(@PathVariable String name) {
        try {
            return ResponseEntity.ok(postService.searchByName(name));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(@PathVariable Long postId, @RequestBody Post postDetails) {
        try {
            Post post = postService.getPostById(postId);

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            if (post.getUser() != null && !post.getUser().getEmail().equals(email)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You are not authorized to update this post.");
            }

            post.setName(postDetails.getName());
            post.setContent(postDetails.getContent());

            return ResponseEntity.ok(postService.savePost(post));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating post: " + e.getMessage());
        }
    }
}
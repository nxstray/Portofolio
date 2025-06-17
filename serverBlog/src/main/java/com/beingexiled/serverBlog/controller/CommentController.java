package com.beingexiled.serverBlog.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.beingexiled.serverBlog.service.CommentService;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin
public class CommentController {
    
    @Autowired
    private CommentService commentService;

    @PostMapping("/create")
    public ResponseEntity<?> createComment(@RequestParam Long postId, @RequestParam String postedBy, @RequestParam String content) {
        try {
            return ResponseEntity.ok(commentService.createComment(postId, postedBy, content));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating comment: " + e.getMessage());
        }
    }
}

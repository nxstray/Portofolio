package com.beingexiled.serverBlog.controller;

import com.beingexiled.serverBlog.dto.CommentDTO;
import com.beingexiled.serverBlog.dto.CommentMapper;
import com.beingexiled.serverBlog.entity.Comment;
import com.beingexiled.serverBlog.service.CommentService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:4200")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/create")
    public ResponseEntity<?> createComment(@RequestParam Long postId, @RequestParam String content) {
        try {
            Comment comment = commentService.createComment(postId, content);
            return ResponseEntity.ok(CommentMapper.toDTO(comment));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating comment: " + e.getMessage());
        }
    }

    @GetMapping("/{postId}")
    public ResponseEntity<?> getCommentsByPostId(@PathVariable Long postId) {
        try {
            List<CommentDTO> dtos = commentService.getCommentsByPostId(postId)
                    .stream()
                    .map(CommentMapper::toDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching comments: ");
        }
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable Long commentId, @RequestParam String content) {
        try {
            Comment updated = commentService.updateComment(commentId, content);
            return ResponseEntity.ok(CommentMapper.toDTO(updated));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating comment: " + e.getMessage());
        }
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        try {
            commentService.deleteComment(commentId);
            return ResponseEntity.ok("Comment deleted successfully.");
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting comment: " + e.getMessage());
        }
    }
}
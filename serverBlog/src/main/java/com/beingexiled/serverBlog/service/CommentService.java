package com.beingexiled.serverBlog.service;

import com.beingexiled.serverBlog.entity.Comment;
import com.beingexiled.serverBlog.entity.Post;
import com.beingexiled.serverBlog.entity.User;
import com.beingexiled.serverBlog.repository.CommentRepository;
import com.beingexiled.serverBlog.repository.PostRepository;
import com.beingexiled.serverBlog.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;


@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public Comment createComment(Long postId, String content) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found for id: " + postId));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found for email: " + email));

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setPost(post);
        comment.setUser(user);
        comment.setCreatedAt(new Date());

        return commentRepository.save(comment);
    }

    public Comment updateComment(Long commentId, String content) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!comment.getUser().getEmail().equals(email)) {
            throw new SecurityException("You are not authorized to update this comment.");
        }
        comment.setContent(content);
        return commentRepository.save(comment);
    }

    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!comment.getUser().getEmail().equals(email)) {
            throw new SecurityException("You are not authorized delete this comment.");
        }
        commentRepository.delete(comment);
    }

    public List<Comment> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostId(postId);
    }
}
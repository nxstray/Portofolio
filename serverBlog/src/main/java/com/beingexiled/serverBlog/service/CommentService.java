package com.beingexiled.serverBlog.service;

import com.beingexiled.serverBlog.entity.Comment;
import com.beingexiled.serverBlog.entity.Post;
import com.beingexiled.serverBlog.repository.CommentRepository;
import com.beingexiled.serverBlog.repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    public Comment createComment(Long postId, String postedBy, String content) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found for id: " + postId));

        Comment comment = new Comment();
        comment.setPostedBy(postedBy);
        comment.setContent(content);
        comment.setPost(post);
        comment.setCreatedAt(new Date());

        return commentRepository.save(comment);
    }
}
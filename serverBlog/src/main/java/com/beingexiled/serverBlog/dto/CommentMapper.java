package com.beingexiled.serverBlog.dto;

import com.beingexiled.serverBlog.entity.Comment;

public class CommentMapper {

    public static CommentDTO toDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());

        if (comment.getUser() != null) {
            dto.setUserEmail(comment.getUser().getEmail());
        }

        if (comment.getPost() != null) {
            dto.setPostId(comment.getPost().getId());
        }

        return dto;
    }
}

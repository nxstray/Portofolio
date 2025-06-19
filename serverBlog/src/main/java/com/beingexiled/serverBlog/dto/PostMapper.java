package com.beingexiled.serverBlog.dto;

import com.beingexiled.serverBlog.entity.Post;

public class PostMapper {
    public static PostDTO toDTO(Post post) {
        PostDTO dto = new PostDTO();
        dto.setId(post.getId());
        dto.setName(post.getName());
        dto.setContent(post.getContent());
        dto.setImg(post.getImg());
        dto.setDate(post.getDate());
        dto.setViewCount(post.getViewCount());
        dto.setTags(post.getTags());
        dto.setAuthorEmail(post.getUser().getEmail());
        
        return dto;
    }
}


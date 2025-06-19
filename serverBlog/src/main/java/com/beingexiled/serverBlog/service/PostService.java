package com.beingexiled.serverBlog.service;

import com.beingexiled.serverBlog.entity.Post;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface PostService {
	
    Post savePost(Post post);

    Post uploadImage(Long postId, MultipartFile imageFile);

    List<Post> getAllPosts();

    Post getPostById(Long postId);

    List<Post> searchByName(String name);
}

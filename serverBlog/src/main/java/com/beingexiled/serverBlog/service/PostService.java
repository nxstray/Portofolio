package com.beingexiled.serverBlog.service;

import com.beingexiled.serverBlog.entity.Post;
import java.util.List;

public interface PostService {
	
    Post savePost(Post post);

    List<Post> getAllPosts();

    Post getPostById(Long postId);
}

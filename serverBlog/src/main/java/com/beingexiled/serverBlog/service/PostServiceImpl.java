package com.beingexiled.serverBlog.service;

import com.beingexiled.serverBlog.entity.Post;
import java.util.Date;
import com.beingexiled.serverBlog.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PostServiceImpl implements PostService {
    // Implement methods from PostService interface here
    @Autowired
    private PostRepository postRepository;

    public Post savePost(Post post) {
        post.setViewCount(0);
        post.setDate(new Date());

        return postRepository.save(post);
    }
}

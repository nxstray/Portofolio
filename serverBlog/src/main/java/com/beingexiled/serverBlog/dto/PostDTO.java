package com.beingexiled.serverBlog.dto;

import java.util.Date;
import java.util.List;

public class PostDTO {
    private Long id;
    private String name;
    private String content;
    private String img;
    private Date date;
    private int viewCount;
    private List<String> tags;
    private String authorEmail;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public int getViewCount() {
        return viewCount;
    }

    public void setViewCount(int viewCount) {
        this.viewCount = viewCount;
    }

     public List <String> getTags() {
        return tags;
    }

    public void setTags(List <String> tags) {
        this.tags = tags;
    }

    public String getAuthorEmail() {
        return authorEmail;
    }

    public void setAuthorEmail(String authorEmail) {
        this.authorEmail = authorEmail;
    }
}

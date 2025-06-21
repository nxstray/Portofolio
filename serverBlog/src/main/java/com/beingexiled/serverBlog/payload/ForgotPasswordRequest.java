package com.beingexiled.serverBlog.payload;

import lombok.Data;

@Data
public class ForgotPasswordRequest {
    private String emailOrUsername;
}
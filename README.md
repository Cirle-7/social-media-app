# SOCIAL_MEDIA_APP
A social media application in the likeness of twitter but for developers in mind.

---
## Stack
*Language : Javascript(nodejs)*
*Database: PostgreSql, MySql*

---

## Basic Features

- Register a new account(JWT & social authentication)
- Login to account (JWT & social authentication)
- Publish a new post
- Like a post
- Comment on a post
- Share user profile
- Upload images and videos to posts
- Follow other users on the platform
- Share/repost a post
- Edit& Delete  a post
- Delete account
- View all users 
- Block all users
- Unblock users
- Delete user
- Unpublish post
- Messaging & rooms

---

## User
| field  |  data_type | constraints  |
|---|---|---|
|  email     | string  | required, unique | 
|  username | string  |  required, unique|
|  displayName  |  string |  required |
|  password |   string |  required  |
|  confirm_password |   string |  required  |

---

### Social authentication


- Github Route: /auth/github
- Google Route: /auth/google
- Method: GET

---
### Signup User

- Route: api/v1/users/signup
- Method: POST
- Body: 
```
{
    "email":"'bandu@gmail.com",
    "password": "secret",
    "confirm_password": "secret",
    "displayName": "bandu",
    "username":"bandu"
}
```

- Responses

Success
```
{
    "status": "Success",
    "data": {
        "user": {
            "id": 18,
            "email": "'bandu@gmail.com",
            "displayName": "bandu",
            "username": "bandu",
            "updatedAt": "2023-02-16T16:38:24.498Z",
            "createdAt": "2023-02-16T16:38:24.498Z"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxOCwiaWF0IjoxNjc2NTY1NTA1LCJleHAiOjE2ODQzNDE1MDV9.JNJcO0kr-k6xiwIW4WBm7oO8TcuebSBTV1bIowM40lU"
    }
}


```
---
### Login User

- Route: auth/login
- Method: POST
- Body: 
```
{
    "email":"josiah@gmail.com",
    "password": "secret"
}
```

- Responses

Success
```
{
    "status": "Success",
    "data": {
        "user": {
            "id": 16,
            "githubId": null,
            "googleId": null,
            "email": "josiah@gmail.com",
            "username": "jojo",
            "displayName": "josiah",
            "passwordToken": null,
            "passwordResetExpires": null,
            "createdAt": "2023-02-16T15:14:20.000Z",
            "updatedAt": "2023-02-16T15:14:20.000Z"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxNiwiaWF0IjoxNjc2NTYwODY1LCJleHAiOjE2ODQzMzY4NjV9.c1iHVw8HdBhBZXWiuyUeqVoSiqu9UHkhbMNUBqnhrdk"
    }
}
```
---
### Post
| field  |  data_type | constraints  |
|---|---|---|
|  body    | string  | required | 
|  media-url | array of image Path  |  |

---

## Post Routes
---
### publish  a post (logged in users only )

- Route: /api/v1/post/
- Method: POST
- Header
    - Cookies: jwt {token}
- Body: Form data

    | KEY  |  VALUE |
    |---|---|
    |body | sugar no dey salt no dey , he just sweet #hello #welcome |
    | media_url | /C:/Users/josiah/Pictures/Screenshots/Screenshot (4).png |
    | media_url | /C:/Users/josiah/Pictures/Screenshots/Screenshot (3).png |
    | media_url | /C:/Users/josiah/Pictures/Screenshots/Screenshot (1).png |
    | media_url | /C:/Users/josiah/Pictures/Screenshots/Screenshot (7).png |



- Responses

Success
```
{
  "status": true,
  "post": {
    "likes": 0,
    "status": "Published",
    "commentsNo": 0,
    "views": 0,
    "id": 10,
    "body": "sugar no dey salt no dey , he just sweet #hello #welcome",
    "userId": 1,
    "media_url": [
      "https://res.cloudinary.com/dhq33r9pa/image/upload/v1676910351/pictures/gonsipofzx98ncqvyikf.png",
      "https://res.cloudinary.com/dhq33r9pa/image/upload/v1676910354/pictures/byri1sh4pojttxutd1ts.png",
      "https://res.cloudinary.com/dhq33r9pa/image/upload/v1676910359/pictures/kfiyqmeypabuespxu8a9.png",
      "https://res.cloudinary.com/dhq33r9pa/image/upload/v1676910365/pictures/k39h7ec19wy6iuumlpon.png"
    ],
    "tags": "#hello #welcome",
    "updatedAt": "2023-02-20T16:26:07.155Z",
    "createdAt": "2023-02-20T16:26:07.155Z"
  }
}
```
---
### Draft a post (logged in users only )

- Route: /api/v1/post/draft
- Method: POST
- Header
    - Cookies: jwt {token}
- Body: Form data

    | KEY  |  VALUE |
    |---|---|
    |body | sugar no dey salt no dey , he just sweet #hello #welcome |
    | media_url | /C:/Users/josiah/Pictures/Screenshots/Screenshot (4).png |
    | media_url | /C:/Users/josiah/Pictures/Screenshots/Screenshot (3).png |
    | media_url | /C:/Users/josiah/Pictures/Screenshots/Screenshot (1).png |
    | media_url | /C:/Users/josiah/Pictures/Screenshots/Screenshot (7).png |



- Responses

Success
```
{
  "status": true,
  "post": {
    "likes": 0,
    "status": "Draft",
    "commentsNo": 0,
    "views": 0,
    "id": 10,
    "body": "sugar no dey salt no dey , he just sweet #hello #welcome",
    "userId": 1,
    "media_url": [
      "https://res.cloudinary.com/dhq33r9pa/image/upload/v1676910351/pictures/gonsipofzx98ncqvyikf.png",
      "https://res.cloudinary.com/dhq33r9pa/image/upload/v1676910354/pictures/byri1sh4pojttxutd1ts.png",
      "https://res.cloudinary.com/dhq33r9pa/image/upload/v1676910359/pictures/kfiyqmeypabuespxu8a9.png",
      "https://res.cloudinary.com/dhq33r9pa/image/upload/v1676910365/pictures/k39h7ec19wy6iuumlpon.png"
    ],
    "tags": "#hello #welcome",
    "updatedAt": "2023-02-20T16:26:07.155Z",
    "createdAt": "2023-02-20T16:26:07.155Z"
  }
}
```
---
### Edit post  (logged in users only )

- Route: /api/v1/post/:postId
- Method: patch
- Header
    - Cookies: jwt {token}
- Body: Form data

    | KEY  |  VALUE |
    |---|---|
    |body | tiktok looks like money ritual to grow frollowers #followers |
    | media_url | /C:/Users/josiah/Pictures/Screenshots/Screenshot (15).png |

- Responses

Success
```
{
  "status": true,
  "updatedPost": {
    "id": 1,
    "body": "changee #change",
    "media_url": [],
    "likesNo": 0,
    "status": "Published",
    "commentsNo": 5,
    "views": 1,
    "tags": "#change",
    "createdAt": "2023-02-24T16:43:05.000Z",
    "updatedAt": "2023-02-24T17:46:45.074Z",
    "userId": 1,
    "user": {
      "id": 1,
      "githubId": null,
      "googleId": null,
      "email": "jojo@gmail.com",
      "username": "jojo",
      "displayName": "chukwu",
      "passwordToken": null,
      "passwordResetExpires": null,
      "createdAt": "2023-02-24T16:36:57.000Z",
      "updatedAt": "2023-02-24T16:36:57.000Z",
      "profile": null
    },
    "likes": [],
    "comments": []
  }
}
```
---
### Delete a  post  (logged in users only )

- Route: /api/v1/post/:postId
- Method: delete
- Header
    - Cookies: jwt {token}
- Responses

Success
```
{
  "message": "Post deleted  successful"
}


```
---
### Get all  Post (logged in users only )


- Route: /api/v1/post
- Method: GET
- Header:
    - Cookies: jwt {token}
- Query params: 
    - status (default: Published )
    - userId 
    - orderBy (default: updatedAt)
    - tags
    - search (search body)
    - limit (default: 10)
- Responses

Success
```
{
 status: true,
 blog:[]
}
```
---
### Get post by id  (logged in users only )

- Route: /api/v1/post/:postId
- Method: GET
- Header
    - Cookies: jwt {token}
- Responses

Success
```
{
  "status": true,
  "post": {
    "id": 1,
    "body": "i dont know what to do #runtown #jojo",
    "media_url": [
      "https://res.cloudinary.com/dhq33r9pa/image/upload/v1677115316/pictures/lipx54ekktwaqozttnkp.png",
      "https://res.cloudinary.com/dhq33r9pa/image/upload/v1677115317/pictures/wv0avows2pykwuimugtv.png"
    ],
    "likesNo": 2,
    "status": "Published",
    "commentsNo": 0,
    "shares": 0,
    "views": 2,
    "tags": "#runtown #jojo",
    "createdAt": "2023-02-23T01:21:57.000Z",
    "updatedAt": "2023-02-23T17:34:12.647Z",
    "userId": 1,
    "user": {
      "id": 1,
      "githubId": null,
      "googleId": null,
      "email": "precious@gmail.com",
      "username": "prere",
      "displayName": "chukwu",
      "passwordToken": null,
      "passwordResetExpires": null,
      "createdAt": "2023-02-23T01:20:59.000Z",
      "updatedAt": "2023-02-23T01:20:59.000Z",
      "profile": null
    },
    "likes": [
      {
        "id": 1,
        "createdAt": "2023-02-23T01:22:20.000Z",
        "updatedAt": "2023-02-23T01:22:20.000Z",
        "userId": 1,
        "postId": 1,
        "commentId": null,
        "commentCommentId": null
      },
      {
        "id": 2,
        "createdAt": "2023-02-23T01:24:47.000Z",
        "updatedAt": "2023-02-23T01:24:47.000Z",
        "userId": 2,
        "postId": 1,
        "commentId": null,
        "commentCommentId": null
      }
    ]
  }
}
```
---
### like a post  (logged in users only )

- Route: /api/v1/post/like/:postId
- Method: post
- Header
    - Cookies: jwt {token}
- Responses

Success
```
{
  "message": "Post Liked"
} 


```
---

### disLike a post  (logged in users only )

- Route: /api/v1/post/like/:postId
- Method: delete
- Header
    - Cookies: jwt {token}
- Responses

Success
```
{
  "message": "Post disLiked"
} 


```
---

### get My Drafts posts  (logged in users only )

- Route: /api/v1/post/myDrafts
- Method: get
- Header
    - Cookies: jwt {token}
- Responses

Success
```
{
 status: true,
 blog:[]
}


```
---
## Comment Routes
---
### comment
| field  |  data_type | constraints  |
|---|---|---|
|  body    | string  | required | 
|  media-url | array of image Path  |  |

---
### Comment on a Post (logged in users only )

- Route: /api/v1/comment/new/:postId
- Method: POST
- Header
    - Cookies: jwt {token}
- Body: Form data

    | KEY  |  VALUE |
    |---|---|
    |body | yes oo :) |
    | media_url | /C:/Users/josiah/Pictures/Screenshots/Screenshot (4).png |



- Responses

Success
```
{
  "status": true,
  "comment": {
    "likesNo": 0,
    "commentsNo": 0,
    "views": 0,
    "id": 3,
    "body": "yes oo :)",
    "userId": 1,
    "media_url": [],
    "tags": "",
    "postId": "1",
    "updatedAt": "2023-02-24T16:53:32.792Z",
    "createdAt": "2023-02-24T16:53:32.792Z"
  }
}
```
---
### get All Comments Of A Post (logged in users only )

- Route: /api/v1/comment/new/:postId
- Method: GET
- Header
    - Cookies: jwt {token}

- Responses

Success
```
{
  "status": true,
  "allComments": []
}
```
---

### delete Comment (logged in users only )

- Route: /api/v1/comment/:commentId
- Method: DELETE
- Header
    - Cookies: jwt {token}

- Responses

Success
```
{
  "message": "Comment deleted  successful"
}
```
---

### Get Comment By Id (logged in users only )

- Route: /api/v1/comment/:commentId
- Method: GET
- Header
    - Cookies: jwt {token}

- Responses

Success
```
{
  "status": true,
  "comment": {
    "id": 4,
    "body": "yes oooo",
    "media_url": "[]",
    "likesNo": 0,
    "commentsNo": 0,
    "views": 1,
    "tags": "",
    "createdAt": "2023-02-24T16:56:01.000Z",
    "updatedAt": "2023-02-24T21:00:43.645Z",
    "userId": 1,
    "postId": 1,
    "user": {
      "id": 1,
      "githubId": null,
      "googleId": null,
      "email": "jojo@gmail.com",
      "username": "jojo",
      "displayName": "chukwu",
      "passwordToken": null,
      "passwordResetExpires": null,
      "createdAt": "2023-02-24T16:36:57.000Z",
      "updatedAt": "2023-02-24T16:36:57.000Z",
      "profile": null
    },
    "likes": []
  }
}
```
---

### like a comment  (logged in users only )

- Route: /api/v1/comment/like/:commentId
- Method: post
- Header
    - Cookies: jwt {token}
- Responses

Success
```
{
  "message": "Comment Liked"
} 


```
---

### disLike a comment  (logged in users only )

- Route: /api/v1/comment/like/:commentId
- Method: delete
- Header
    - Cookies: jwt {token}
- Responses

Success
```
{
  "message": "Comment disLiked"
} 


```
---



## Contributors
- Ademeso Josiah
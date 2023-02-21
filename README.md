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
### Create  a post (logged in users only )

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
    "shares": 0,
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
    "id": 10,
    "body": "tiktok looks like money ritual to grow frollowers #followers",
    "media_url": "https://res.cloudinary.com/dhq33r9pa/image/upload/v1676913303/pictures/vlvrsci9eemhj1oq5skg.png",
    "likes": 0,
    "status": "Published",
    "commentsNo": 0,
    "shares": 0,
    "views": 0,
    "tags": "#followers",
    "createdAt": "2023-02-20T16:26:07.000Z",
    "updatedAt": "2023-02-20T17:15:06.198Z",
    "userId": 1
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
    - limit
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
    "id": 4,
    "body": "sugar no dey salt no dey , he just sweet",
    "media_url": [
      "https://res.cloudinary.com/dhq33r9pa/image/upload/v1676676765/pictures/g0k69xmz48dxwydsy4pa.png",
      "https://res.cloudinary.com/dhq33r9pa/image/upload/v1676676766/pictures/ja2cr1owl2kmanqzv1dv.png",
      "https://res.cloudinary.com/dhq33r9pa/image/upload/v1676676769/pictures/f9608wbzkic8o2oqthek.png",
      "https://res.cloudinary.com/dhq33r9pa/image/upload/v1676676772/pictures/kbatzvnnlxxpimvg8g6f.png"
    ],
    "likes": 0,
    "status": "Published",
    "commentsNo": 0,
    "shares": 0,
    "views": 1,
    "tags": null,
    "createdAt": "2023-02-17T23:32:54.000Z",
    "updatedAt": "2023-02-20T17:57:31.338Z",
    "userId": 1,
    "user": {
      "id": 1,
      "githubId": null,
      "googleId": null,
      "email": "chukwu@gmail.com",
      "username": "chukwu",
      "displayName": "chukwu",
      "passwordToken": null,
      "passwordResetExpires": null,
      "createdAt": "2023-02-17T23:13:28.000Z",
      "updatedAt": "2023-02-17T23:13:28.000Z"
    },
    "comments": []
  },
  "profileUrl": "http://localhost:3310/api/v1/profiles/chukwu"
}
```
---
### Draft a  post  (logged in users only )

- Route: /api/v1/post/draft/:postId
- Method: put
- Header
    - Cookies: jwt {token}
- Responses

Success
```
{
  "message": "Post Drafted"
} 


```
---

## Contributors
- Ademeso Josiah
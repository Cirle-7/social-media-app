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

### User
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

## Profiles
| field  |  data_type | constraints  |
|---|---|---|
|  bio     | string  |  | 
|  website | string  |  |
|  location  |  string |   |
|  github_link |   string |    |
|  twitter_link |   string |    |
|  avatarURL |   string |    |
|  headerURL |   string |    |
|  followers |   string |    |

---
## Profile Routes
---
### Create  profile (logged in and owner of account )

- Route: /api/v1/profiles/
- Method: POST
- Header
    - Cookies: jwt {token}
- Body: Form data

    | KEY  |  VALUE |
    |---|---|
    |  bio     | too little space for an about  |  
    |  website | string  |  
    |  location  |  Accra, Ghana |   
    |  github_link |   https://github.com/me |   
    |  twitter_link |   https://twitter.com/me | 
    |  avatar(file) |   avatar-img.jpg |    
    |  header(file) |   header-img.png |    


- Responses

Success
```
{
  "message": "profile create successful",
  "status": true,
  "data": {
    "profile": {
      "id": 1,
      "Bio": "this is my bio",
      "website": "https://mywebsite.com",
      "github_link": "https://github.com/link",
      "twitter_link": "https://twitter.com/me",
      "avatarURL": "http://res.cloudinary.com/di4y0ladi/image/upload/v1676993236/tcfh3zmsp6rjha0xe9fm.jpg",
      "headerURL": "http://res.cloudinary.com/di4y0ladi/image/upload/v1676993238/on11c5ctymn6noyslddi.png",
      "userId": 2,
      "updatedAt": "2023-02-21T15:25:48.262Z",
      "createdAt": "2023-02-21T15:25:48.262Z"
    }
  }
}
```
---

### Edit  profile (logged in and owner of account )

- Route: /api/v1/profiles/id
- Method: PATCH
- Header
    - Cookies: jwt {token}
- Body: Form data

    | KEY  |  VALUE |
    |---|---|
    |  bio     | this is my bio  |  
    |  website | www.mywebsite.me  |  
    |  location  |  Accra, Ghana |   
    |  github_link |   www.github.com/me |   
    |  twitter_link |   www.twitter.com/me |  
    |  header(file) |   header-img.png |    


- Responses

Success
```
{
  "message": "profile updated",
  "status": true,
  "data": {
    "update": {
      "id": 1,
      "Bio": "this is my bio",
      "website": "https://mywebsite.com",
      "location": null,
      "github_link": "https://github.com/link",
      "twitter_link": "https://twitter.com/me",
      "headerURL": "http://res.cloudinary.com/di4y0ladi/image/upload/v1676994044/t2vbx9whrkkkkxmwt0hh.png",
      "avatarURL": "http://res.cloudinary.com/di4y0ladi/image/upload/v1676993236/tcfh3zmsp6rjha0xe9fm.jpg",
      "followers": null,
      "createdAt": "2023-02-21T15:25:48.000Z",
      "updatedAt": "2023-02-21T15:39:14.441Z",
      "userId": 2
    }
  }
}
```
---

### Get profile of user

- Route: /api/v1/profiles/username
- Method: GET

- Responses

Success
```
{
  "status": "success",
  "message": "Profile found",
  "data": {
    "profile": {
      "username": "jonaa",
      "displayName": "jonaa",
      "Bio": "this is my bio",
      "website": "https://mywebsite.com",
      "location": null,
      "github_link": "https://github.com/link",
      "twitter_link": "https://twitter.com/me",
      "avatarURL": "http://res.cloudinary.com/di4y0ladi/image/upload/v1676993236/tcfh3zmsp6rjha0xe9fm.jpg",
      "headerURL": "http://res.cloudinary.com/di4y0ladi/image/upload/v1676994044/t2vbx9whrkkkkxmwt0hh.png",
      "followers": null
    }
  }
}
```
---

## Followers
| field  |  data_type | constraints  |
|---|---|---|
|  followerId     | number  |  | 
|  userId | number  |  |

---
## Follow Routes
---
### Follow another user 

- Route: /api/v1/follow/username
- Method: POST
- Header
    - Cookies: jwt {token}

- Responses

Success
```
{
  "status": "success",
  "message": "User followed"
}
```
---

### Unfollow user 

- Route: /api/v1/unfollow/username
- Method: DELETE
- Header
    - Cookies: jwt {token}

- Responses

Success
```
{
  "status": "success",
  "message": "Unfollowed user"
}
```
---

## Block accounts
| field  |  data_type | constraints  |
|---|---|---|
|  blockedUser     | number  |  | 
|  userId | number  |  |

---
## Block Routes
---
### Block user 

- Route: /api/v1/user/block/username
- Method: POST
- Header
    - Cookies: jwt {token}

- Responses

Success
```
{
  "status": "success",
  "message": "User blocked"
}
```
---

### Unblock user 

- Route: /api/v1/user/unblock/username
- Method: DELETE
- Header
    - Cookies: jwt {token}

- Responses

Success
```
{
  "status": "success",
  "message": "User unblocked"
}
```
---


## Privating account Routes
---
### Make account private

- Route: /api/v1/account/private
- Method: PATCH
- Header
    - Cookies: jwt {token}

- Responses

Success
```
{
  "message": "Account Private Successful"
}
```
---

### Make account public 

- Route: /api/v1/account/public
- Method: PATCH
- Header
    - Cookies: jwt {token}

- Responses

Success
```
{
  "message": "Account Public Successful"
}
```
---

## Contributors
- Ademeso Josiah
- Etorko-Gbeku Justice

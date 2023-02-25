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
| field            | data_type | constraints      |
| ---------------- | --------- | ---------------- |
| email            | string    | required, unique |
| username         | string    | required, unique |
| displayName      | string    | required         |
| password         | string    | required         |
| confirm_password | string    | required         |

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
### Request Account Deactivation

- Route: account/delete
- Method: PATCH

- Responses

Success
```
{
    "status": "success",
    "message": "A link has been sent to your mail. Please check your mail to continue.
}}
```
---
### Deactivate Account

- Route: account/deactivate
- Method: PATCH

- Responses

Success
```
{
    "status": true,
    "message": "Your account has been deactivated, and will be permanently deleted after 30days of inactivity. Thanks"
}
```
---
### Get Profile - When deactivated
- Route: profile/ssamuel
- Method: GET

- Responses

Success

```
{
    "status": "success",
    "message": "This account is deactivated",
    "data": {
        "profile": {
            "username": "Samuel",
            "displayName": "Korku",
            "Bio": "A normal user",
            "website": null,
            "location": null,
            "github_link": null,
            "twitter_link": null,
            "avatarURL": "http://res.cloudinary.com/di4y0ladi/image/upload/v1677003471/urtw4ionpp5i8e6knkft.jpg",
            "headerURL": "https://cdn.pixabay.com/photo/2016/08/30/16/26/banner-1631296__340.jpg",
            "followers": null,
            "isdeactivated": true
        }
    }
}
```
NOTE: SOME FIELDS LIKE website, github_link, twitter_link AND location, WILL RETURN 'null' WHEN THE AN ACCOUNT IS DEACTIVATED

---
### Get Profile - When deactivated
- Route: users/login
- Method: POST
- Body
```
  { 
    "email" : "jojo@gmail.com",
    "password" : "Kelechi123"
}

```
- Responses
```
{
    "status": "Fail",
    "error": {
        "statusCode": 400,
        "status": "Fail",
        "isOperational": true,
        "level":"[31merror[39m",
        "timestamp": "2023-02-21 21:06:06:66"
    },
    "message":"[31mYour account is presently deactivated! [39m\n[31m  Click http://localhost:3310/api/v1/account/activate to activate[39m"
}
```
---
### Get Activate Account
- Route: account/activate
- Method: GET
- Responses
```
{
    A FORM PAGE FOR EMAIL AND PASSWORD FOR NORMAL USERS, AND OAUTH FOR SOCIAL USERS 
}
```
---
### Activate account
- Route: account/activate
- Method: PATCH
- Body
```
  { 
    "email" : "jojo@gmail.com",
    "password" : "Kelechi123"
}

```
- Responses
```
{
    "status": "Success",
    "data": {
        "user": {
            "id": 6,
            "githubId": null,
            "googleId": null,
            "email": "jojo@gmail.com",
            "username": "Samuel",
            "displayName": "Korku",
            "passwordToken": null,
            "passwordResetExpires": null,
            "deletionDate": null,
            "createdAt": "2023-02-21T18:16:59.000Z",
            "updatedAt": "2023-02-21T19:56:34.013Z"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJpYXQiOjE2NzcwMDkzOTQsImV4cCI6MTY4NDc4NTM5NH0.swSoyJslxSvXj_rJjcyOZ72TVXXw3rW5dv6Q1cVdM6g"
    }
}
```
---
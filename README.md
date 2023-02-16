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

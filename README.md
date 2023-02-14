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
    "email":"chukwu@gmail.com",
    "password": "kelechi123",
    "confirm_password": "kelechi123",
    "displayName": "chukwu",
    "username":"chukwu"
}
```

- Responses

Success
```
{
  "user": {
    "first_name": "eri",
    "last_name": "Ogunseye",
    "email": "eri@gmail.com",
    "password": "$2b$10$n4DlouV0ucabGCXHQ5gKeeyPO/ar8Gyzygqf.3Qi3.fK8pfQD8WdG",
    "_id": "636678b7283f52463dde032f",
    "__v": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjM2Njc4YjcyODNmNTI0NjNkZGUwMzJmIiwiZW1haWwiOiJlcmlAZ21haWwuY29tIiwiZnVsbG5hbWUiOiJlcmkgT2d1bnNleWUiLCJpYXQiOjE2Njc2NTk5NTksImV4cCI6MTY2ODI2NDc1OX0.JWDLGOAkCtIAKmd1nR6Yr4RPZCoz5fwZ3Xy3JEy5yA4",
  "message": "account succesfully created"
}


```
---

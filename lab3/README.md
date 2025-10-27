# webtech-207
**Cours:  Technologies Web / lab3**
Depository Tech_Web Angel Velasco Michael Adda

Learn Express to build web API.

## Objectives

- Server-side programming with Node.js
- Web server with Express
- Practice unit tests and learn about GraphQL


## Part 1. Refactor your previous application to use Express

1. [Install Express](https://www.npmjs.com/package/express#installation)
2. Read the [basic routing documentation](http://expressjs.com/en/starter/basic-routing.html).
3. Refactor your conditional routing to Express bringing a modular source code structure using [express.Router](https://expressjs.com/en/guide/routing.html#express-router) middleware.
4. Use [Postman](https://www.postman.com/) or [Swagger Inspector](https://inspector.swagger.io) or `curl` Bash command to manually test your application. Choose your preference.
5. Commit your changes following [Conventional Commits](https://www.conventionalcommits.org)

## Part 2. Build an API

### 2.1. Prepare an example database model

For the sake of simplicity, use a hard-coded database with a global variable to store articles and their comments. For example:

```js
const db = {
  articles: [
    {
      id: '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
      title: 'My article',
      content: 'Content of the article.',
      date: '04/10/2022',
      author: 'Liz Gringer'
    },
    // ...
  ],
  comments: [
    {
      id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
      timestamp: 1664835049,
      content: 'Content of the comment.',
      articleId: '6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b',
      author: 'Bob McLaren'
    },
    // ...
  ]
}
```

### 2.2. Create a set of API routes to manage articles

- GET `/articles` - list all articles
- POST `/articles` - add a new article
- GET `/articles/:articleId` - get an article by ID

### 2.3. Create a set of API routes to manage articles

- GET `/articles/:articleId/comments` - get all comments of the article with `articleId`
- POST `/articles/:articleId/comments` - add a new comment to a specific article with `articleId`
- GET `/articles/:articleId/comments/:commentId` - get a comment with `commentId` of the article with `articleId`


**Run Post in Powershell - add a new article**
```js
Invoke-RestMethod -Uri "http://localhost:8080/articles" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"title":"Nouveau titre","content":"Mon contenu","author":"Alice"}'
```
**Run Post in Powershell - add a new comment to a specific article with `articleId`**
```js
Invoke-RestMethod -Uri "http://localhost:8080/articles/6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b/comments" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"content":"Super article","author":"Bob"}'
```
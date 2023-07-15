import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as crypto from "crypto";

const app = express();

app.use(cors());
app.use(
  bodyParser.json({
    type(req) {
      return true;
    },
  })
);
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

let posts = [
  {
    id: crypto.randomUUID(),
    name: "Олеся",
    content: "Привет!",
    created: Date.now(),
    status: false,
    coordinates: "[55.9153, 38.1092]",
    img: null,
    audio: null,
    video: null,
    fileName: null,
  },
];

let users = [
  {
    id: crypto.randomUUID(),
    user: "Олеся"
  }
];

let currentUser;
let pinnedPost = { content: 'Мыши плакали, кололись, но продолжали грызть кактус (с)' };

app.use(async (request, response) => {
  const { method, id } = request.query;
  switch (method) {    
    case "postById": {
      const createData = request.body;
      pinnedPost = posts.find((post) => post.id === createData.id);
      if (!pinnedPost) {
        response
          .status(404)
          .send(JSON.stringify({ message: "Post not found" }))
          .end();
        break;
      }
      response.send(JSON.stringify(pinnedPost)).end();
      break;
    }
    case "getPinnedPost": {      
      response.send(JSON.stringify(pinnedPost)).end();
      break;
    }       
    case "userByName": {
      const createData = request.body;     
      const user = users.find((client) => client.user === createData.user);      
      if (!user) {
        response
          .status(404)
          .send(JSON.stringify({ status: "error", message: "User not found" }))
          .end();
        break;
      }
      currentUser = createData.user;      
      response.send(JSON.stringify(user)).end();
      break;
    }
    case "createPost": {
      try {
        const createData = request.body;
        const newPost = {
          id: crypto.randomUUID(),
          name: createData.name,
          content: createData.content || "",
          created: createData.created,
          status: false,
          coordinates: createData.coordinates,
          img: createData.img,
          audio: createData.audio,
          video: createData.video,
          fileName: createData.fileName,
        };
        posts.push(newPost);
        response.send(JSON.stringify(newPost)).end();
      } catch (error) {
        response.status(500).send(JSON.stringify({ error: error.message }));
      }
      break;
    }
    case "allPostsByUser": {
      let currentPosts = posts.filter((post) => post.name === currentUser);
      if (currentPosts.length === 0) {
        response
          .status(404)
          .send(JSON.stringify({ message: "Post not found" }))
          .end();
        break;
      }
      response.send(JSON.stringify(currentPosts)).end();
      break;
    }
    case "createUser": {
      if (Object.keys(request.body).length === 0) {
        const result = {
          status: "error",
          message: "This name is already taken!",
        };
        response.status(400).send(JSON.stringify(result)).end();
      }
        const { user } = request.body;
        console.log('request.body');
        console.log(request.body);
        const isExist = users.find((client) => client.user === user);
        if (!isExist) {
        const newUser = {
          id: crypto.randomUUID(),
          user         
        };
        users.push(newUser);
        currentUser = newUser.user;
        const result = {
          status: "ok",
          user: newUser,
        };
        response.send(JSON.stringify(result)).end();
      } else {
        const result = {
          status: "error",
          message: "This name is already taken!",
        };    
        response.status(409).send(JSON.stringify(result)).end();
      }
      break;
    }
    case "deleteById": {
      const post = posts.find((post) => post.id === id);
      if (post) {
        posts = posts.filter((post) => post.id !== id);
        response.status(204).end();
      } else {
        response
          .status(404)
          .send(JSON.stringify({ message: "Post not found" }))
          .end();
      }
      break;
    }
    case "updateById": {
      const post = posts.find((post) => post.id === id);
      let updateData = request.body;
      updateData.status = true;
      if (post) {        
        Object.assign(post, updateData);
        response.send(JSON.stringify(posts));
      } else {
        response
          .status(404)
          .send(JSON.stringify({ message: "Post not found" }))
          .end();
      }
      break;
    }
    default:
      response.status(404).end();
      break;
  }
  console.log(posts);
});

const port = process.env.PORT || 3000;
const bootstrap = async () => {
  try {
    app.listen(port, () =>
        console.log(`Server has been started on http://localhost:${port}`)
    );
  } catch (error) {
    console.error(error);
  }
};

bootstrap();
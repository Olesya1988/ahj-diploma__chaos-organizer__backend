import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import { posts } from './messages.js';
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

app.use(express.raw({type: 'image/*', limit: '10mb'}));

let users = [
  {
    id: crypto.randomUUID(),
    user: "Олеся"
  }
];

let currentUser;
let pinnedPost = [
  { 
    content: 'Мыши плакали, кололись, но продолжали грызть кактус (с)',
    user: "Олеся"
  }
];
let searchPosts;
let profilePhotoClassName = [
  { 
    class: 'modal-settings__photo-cat',
    user: "Олеся"
  }
];

app.use(async (request, response) => {
  const { method, id } = request.query;
  switch (method) {    
    case "postById": { // получение поста, выбранного для закрепа
      const createData = request.body;      
      let pinned = posts.find((post) => post.id === createData.id);
      let result = pinnedPost.find((post) => post.user === createData.user);
      if (!result) {
        pinnedPost.push({content: pinned.content, user: createData.user});
      } else {
        result.content = pinned.content;
      }
      if (!pinned) {
        response
          .status(404)
          .send(JSON.stringify({ message: "Post not found" }))
          .end();
        break;
      }
      response.send(JSON.stringify(pinned)).end();
      break;
    }
    case "searchByWord": { // поиск постов по заданному слову
      const createData = request.body.word.toLowerCase();
      
      searchPosts = posts.filter((post) => post.content.toLowerCase().includes(createData));
      if (!searchPosts) {
        response
          .status(404)
          .send(JSON.stringify({ message: "Post not found" }))
          .end();
        break;
      }
      response.send(JSON.stringify(searchPosts)).end();
      break;
    }
    case "getPinnedPost": { // отправка закрепа
      let result = pinnedPost.find((post) => post.user === currentUser);
      if (!result) {
        response
          .status(404)
          .send(JSON.stringify({ message: "Post not found" }))
          .end();
        break;
      }
      response.send(JSON.stringify(result)).end();
      break;
    }   
    case "getSearch": { // отправка результата поиска
      response.send(JSON.stringify(searchPosts)).end();
      break;
    }    
    case "userByName": { // получение текущего пользователя
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
    case "createPost": { // создание нового поста
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

        console.log(createData);

        if (createData.img) {
          fs.writeFile(`./uploads/${createData.fileName}`, `${createData.img}`, function(err) {
            if (err)
              console.log("Ничего не вышло, и вот почему:", err);
            else
              console.log("Запись успешна. Все свободны.");
          });
        } else if (createData.audio) {
          fs.writeFile(`./uploads/${createData.fileName}`, `${createData.audio}`, function(err) {
            if (err)
              console.log("Ничего не вышло, и вот почему:", err);
            else
              console.log("Запись успешна. Все свободны.");
          });
        } else if (createData.video) {
          fs.writeFile(`./uploads/${createData.fileName}`, `${createData.video}`, function(err) {
            if (err)
              console.log("Ничего не вышло, и вот почему:", err);
            else
              console.log("Запись успешна. Все свободны.");
          });
        }

        posts.push(newPost);
        response.send(JSON.stringify(newPost)).end();
      } catch (error) {
        response.status(500).send(JSON.stringify({ error: error.message }));
      }
      break;
    }    
    case "allPostsByUser": { // все посты авторизованного пользователя
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
    case "createUser": { // создание нового пользователя
      if (Object.keys(request.body).length === 0) {
        const result = {
          status: "error",
          message: "This name is already taken!",
        };
        response.status(400).send(JSON.stringify(result)).end();
      }
        const { user } = request.body;        
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
    case "deleteById": { // удаление поста
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
    case "updateById": { // обновление поста
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
    case "updatePhoto": { // обновление фото профиля   
      let updateData = request.body;   
      let className = updateData.profilePhotoClassName;
      
      let result = profilePhotoClassName.find((name) => name.user === updateData.user);
      if (!result) {
        profilePhotoClassName.push({class: className, user: updateData.user});
      } else {
        result.class = className;
      }
      if (result) {        
        response.send(JSON.stringify(profilePhotoClassName));
      } else {
        response
          .status(404)
          .send(JSON.stringify({ message: "profilePhotoClassName not found" }))
          .end();
      }
      break;
    }
    case "getUpdatePhoto": { // отправка фото
      let result = profilePhotoClassName.find((name) => name.user === currentUser);
      if (!result) {
        response
          .status(404)
          .send(JSON.stringify({ message: "ProfilePhotoClassName not found" }))
          .end();
        break;
      }
      response.send(JSON.stringify(result)).end();
      break;      
    }
    default:
      response.status(404).end();
      break;
  }
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
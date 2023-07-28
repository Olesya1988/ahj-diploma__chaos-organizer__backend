import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import * as crypto from "crypto";
import fs from "fs";

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

let posts = [
  {
    id: crypto.randomUUID(),
    name: "Олеся",
    content: `
    <b>5 полезных сайтов для начинающих программистов:</b><br>
    <b>1. StackOverflow<br></b>
      https://stackoverflow.com/<br>
      Язык: английский<br>
      StackOverflow — это самая большая база вопросов и ответов по программированию в интернете. 
      Скорее всего, любая проблема, которая у вас возникает, уже решена на этом сайте.<br>
    <b>2. CodeProject</b><br>
      https://www.codeproject.com/<br>
      Язык: английский<br>
      Если StackOverflow — это только вопросы и ответы, то CodeProject — это ещё и обучающие статьи, примеры и материалы по новым технологиям. 
      Поэтому, если вам нужно не просто готовое и быстрое решение, но ещё хочется разобраться, почему всё работает именно так, — читайте CodeProject.<br>
    <b>3. Киберфорум</b><br>
      https://www.cyberforum.ru/<br>
      Язык: русский<br>
      У Киберфорума старый классический дизайн из нулевых — сайт запустился ровно в 2000 году, и с тех пор форумный движок внешне почти не изменился. 
      Но несмотря на несовременный дизайн, на сайте огромное количество готовых решений, разборов кода, тонкостей программирования и обсуждения ошибок — и всё на русском языке.<br>
    <b>4. Хабр Разработка</b><br>
      https://habr.com/ru/flows/develop/<br>
      Язык: русский<br>
      Это единственный сайт в нашей подборке, где можно и задать вопрос, и найти подробную статью на любую тему по программированию, 
      и при этом всё это на русском языке. Уровень квалификации участников на Хабре обычно высокий, поэтому ребята пишут подробные и глубокие статьи на самые разные айтишные темы. 
      Если вам хочется погрузиться во взрослую разработку и почитать про нестандартные решения сложных (и простых) проблем — зарегистрируйтесь и настройте ленту под себя.<br>
      Так вы сможете видеть материалы только на те темы, которые вам интересны.<br>
    <b>5. Дока</b><br>
      https://doka.guide/<br>
      Язык: русский<br>
      В Доке нет привычных вопросов и ответов, как на сайтах из примеров выше. Вместо этого создатели написали и собрали в одном месте почти все материалы по веб-разработке для новичков: HTML + CSS + JavaScript.
      Каждая тема и пример разобраны настолько подробно, что снимают все вопросы даже у самых начинающих. Например, в теме про переменные ребята приводят целых 26 примеров, как объявлять const, var и let.
      `,    
    created: Date.now(),
    status: false,
    coordinates: "[55.9153, 38.1092]",
    img: null,
    audio: null,
    video: null,
    fileName: null,
  },
  {
    id: crypto.randomUUID(),
    name: "Олеся",
    content: 'А почему, когда она из другой комнаты задает мне вопрос, и я слышу последние два слова — вот это вот, знаешь, типа: «абу-бу-бу-бу-бу... ЗЕЛЁНЫЕ ТАПОЧКИ?!» Я спрашиваю: «Что?» Она говорит: «ЗЕЛЁНЫЕ ТАПОЧКИ!» Почему она повторяет ровно то, что я слышал?! Вот эти последние два слова. Как ей это удается, а? (Из "О чём говорят мужчины")',
    created: Date.now(),
    status: false,
    coordinates: "[55.9153, 38.1092]",
    img: null,
    audio: null,
    video: null,
    fileName: null,
  },
  {
    id: crypto.randomUUID(),
    name: "Олеся",
    content: `
    <b>Жизнь коротка (М. Жванецкий)</b><br>
Жизнь коротка. И надо уметь.<br>
Надо уметь уходить с плохого фильма. Бросать плохую книгу.<br>
Уходить от плохого человека.<br>
Их много.<br>
Дела неидущие бросать.<br>
Даже от посредственности уходить.<br>
Их много. Время дороже.<br>
Лучше поспать.<br>
Лучше поесть.<br>
Лучше посмотреть на огонь, на ребенка, на женщину, на воду.<br>
Музыка стала врагом человека.<br>
Музыка навязывается, лезет в уши.<br>
Через стены.<br>
Через потолок.<br>
Через пол.<br>
Вдыхаешь музыку и удары синтезаторов.<br>
Низкие бьют в грудь, высокие зудят под пломбами.<br>
Спектакль – менее наглый, но с него тоже не уйдешь.<br>
Шикают. Одергивают.<br>
Ставят подножку.<br>
Компьютер – прилипчив, светится, как привидение, зазывает, как восточный базар.<br>
Копаешься, ищешь, ищешь.<br>
Ну находишь что-то, пытаешься это приспособить, выбрасываешь, снова копаешься, нашел что-то, повертел в голове, выбросил.<br>
Мысли общие.<br>
Слова общие...<br>
Нет!<br>
Жизнь коротка.<br>
И только книга деликатна.<br>
Снял с полки. Полистал. Поставил.<br>
В ней нет наглости.<br>
Она не проникает в тебя без спросу.<br>
Стоит на полке, молчит, ждет, когда возьмут в теплые руки.<br>
И она раскроется.<br>
Если бы с людьми так.<br>
Нас много. Всех не полистаешь.<br>
Даже одного.<br>
Даже своего.<br>
Даже себя.<br>
Жизнь коротка.<br>
Что-то откроется само.<br>
Для чего-то установишь правила.<br>
На остальное нет времени.<br>
Закон один: уходить.<br>
Бросать.<br>
Бежать.<br>
Захлопывать или не открывать!<br>
Чтобы не отдать этому миг, назначенный для другого.
    `,
    created: Date.now(),
    status: false,
    coordinates: "[55.9153, 38.1092]",
    img: null,
    audio: null,
    video: null,
    fileName: null,
  },
  {
    id: crypto.randomUUID(),
    name: "Олеся",
    content: "Перед тем, как удалять файлы, убедитесь, что они не ваши.",
    created: Date.now(),
    status: false,
    coordinates: "[55.9153, 38.1092]",
    img: null,
    audio: null,
    video: null,
    fileName: null,
  },
  {
    id: crypto.randomUUID(),
    name: "Олеся",
    content: "Мыши плакали, кололись, но продолжали грызть кактус (с)",
    created: Date.now(),
    status: false,
    coordinates: "[55.9153, 38.1092]",
    img: null,
    audio: null,
    video: null,
    fileName: null,
  },
  {
    id: crypto.randomUUID(),
    name: "Олеся",
    content: "Что американский писатель Стивен Кинг назвал самой большой замочной скважиной в истории человечества?",
    created: Date.now(),
    status: false,
    coordinates: "[55.9153, 38.1092]",
    img: null,
    audio: null,
    video: null,
    fileName: null,
  },
  {
    id: crypto.randomUUID(),
    name: "Олеся",
    content: "Закончите пословицу: «Лучше пусть я буду там, где думает моя жена, чем там, где представляет меня…».",
    created: Date.now(),
    status: false,
    coordinates: "[55.9153, 38.1092]",
    img: null,
    audio: null,
    video: null,
    fileName: null,
  },
  {
    id: crypto.randomUUID(),
    name: "Олеся",
    content: `<b>Карелия</b> — один из самых красивых регионов России. Страна озер. Страна спокойной северной природы. Край мастеров. Один большой природный заповедник. <br>
    Здесь находится Валаам — уникальный монастырь, ведущий свою историю с 15 века. На острове Кижи туристы найдут неповторимый ансамбль деревянного зодчества. 
    Здесь же несет свои воды второй по величине равнинный водопад Европы — Кивач.<br> 
    Республика Карелия граничит с Финляндией, у этого места богатая история. В Финляндии до сих пор есть две провинции — Северная и Южная Карелия. 
    А на российской стороне сохранилось много населенных пунктов с финскими названиями: Лахденпохья, Тюппега и другие.`,
    created: Date.now(),
    status: false,
    coordinates: "[55.9153, 38.1092]",
    img: null,
    audio: null,
    video: null,
    fileName: null,
  },
  {
    id: crypto.randomUUID(),
    name: "Олеся",
    content: `
    <b>Лайфхак: как отличить британского кота от шотландского?</b><br>
    Наверняка многие видели объявления «Продам вислоухого британского котенка». 
    Если вы решили приобрести кота или кошку с узнаваемой плюшевой шубкой, то запомните – вислоухих британцев не существует! 
    Такой породы просто нет. Есть только вислоухие шотландцы, и называются они Скоттиш-Фолд (гладкошерстная) и Хайленд-Фолд (длинношерстная). 
    Также у шотландской породы есть прямоухие представители — Скоттиш-Страйт с короткой шерстью и Хайленд-Страйт с длинной. 
    `,
    created: Date.now(),
    status: false,
    coordinates: "[55.9153, 38.1092]",
    img: null,
    audio: null,
    video: null,
    fileName: null,
  },
  {
    id: crypto.randomUUID(),
    name: "Олеся",
    content: "1",
    created: Date.now(),
    status: false,
    coordinates: "[55.9153, 38.1092]",
    img: null,
    audio: null,
    video: null,
    fileName: null,
  },
  {
    id: crypto.randomUUID(),
    name: "Олеся",
    content: "2",
    created: Date.now(),
    status: false,
    coordinates: "[55.9153, 38.1092]",
    img: null,
    audio: null,
    video: null,
    fileName: null,
  },
  {
    id: crypto.randomUUID(),
    name: "Олеся",
    content: "3",
    created: Date.now(),
    status: false,
    coordinates: "[55.9153, 38.1092]",
    img: null,
    audio: null,
    video: null,
    fileName: null,
  },
  {
    id: crypto.randomUUID(),
    name: "Олеся",
    content: "4",
    created: Date.now(),
    status: false,
    coordinates: "[55.9153, 38.1092]",
    img: null,
    audio: null,
    video: null,
    fileName: null,
  },
  {
    id: crypto.randomUUID(),
    name: "Олеся",
    content: "5",
    created: Date.now(),
    status: false,
    coordinates: "[55.9153, 38.1092]",
    img: null,
    audio: null,
    video: null,
    fileName: null,
  },
  {
    id: crypto.randomUUID(),
    name: "Олеся",
    content: "6",
    created: Date.now(),
    status: false,
    coordinates: "[55.9153, 38.1092]",
    img: null,
    audio: null,
    video: null,
    fileName: null,
  },
  {
    id: crypto.randomUUID(),
    name: "Олеся",
    content: "7",
    created: Date.now(),
    status: false,
    coordinates: "[55.9153, 38.1092]",
    img: null,
    audio: null,
    video: null,
    fileName: null,
  },
  {
    id: crypto.randomUUID(),
    name: "Олеся",
    content: "8",
    created: Date.now(),
    status: false,
    coordinates: "[55.9153, 38.1092]",
    img: null,
    audio: null,
    video: null,
    fileName: null,
  },
  {
    id: crypto.randomUUID(),
    name: "Олеся",
    content: "9",
    created: Date.now(),
    status: false,
    coordinates: "[55.9153, 38.1092]",
    img: null,
    audio: null,
    video: null,
    fileName: null,
  },
  {
    id: crypto.randomUUID(),
    name: "Олеся",
    content: "10",
    created: Date.now(),
    status: false,
    coordinates: "[55.9153, 38.1092]",
    img: null,
    audio: null,
    video: null,
    fileName: null,
  },
  {
    id: crypto.randomUUID(),
    name: "Олеся",
    content: "11",
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
             
        fs.writeFile(`./uploads/${createData.fileName}`, `${createData.img}`, function(err) {
          if (err)
            console.log("Ничего не вышло, и вот почему:", err);
          else
            console.log("Запись успешна. Все свободны.");
        });

       
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
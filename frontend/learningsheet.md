//npm create vite@latest frontend -- --template react-ts 
   // npm = node package manager
   // vite = tool used to create and run frontend dev env.
    //"frontend" just folder name

//http://localhost:5174/    App.tsx is this code
// "code ." opens current folder

// => run this func when something happens
//react is that the user sees and clicks
//express helps node.js act like a web server

//Invoke-RestMethod = powershell command to talk to APIs. sends HTTP/API request
//CORS = cross origin resource sharing. because frontend and backend are running at diff addresses, tells express server to allow requests from other origins

// our app.tsx sends requests and displays data, server.js requests and handles data

sql lite- small db system that stores data in a single file on a computer
express- backend framework that lets us create routes

CRUD API: create(post), read(get), update(put), delete(delete)

DO NOT put frontend/backend/db all in one container. NEVER do that, split them into their own respective containers

first phase of testing, container only has backend code and sqlite db. no frontend, thats on vite

container= temporary
volume= external hard drive. persistent storage managed differently from container
-v spanish-bank-data:/app/data

Invoke-RestMethod `
  -Uri "http://localhost:3000/words" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"spanish":"persistir","english":"to persist"}'

  compose file just does all docker terminal commands
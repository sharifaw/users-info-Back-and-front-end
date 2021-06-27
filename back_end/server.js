const express = require('express')
const app = express()
const port = 2000
let users = [ 
  // {
//   "id": 7,
//   "email": "michael.lawson@reqres.in",
//   "first_name": "Michael",
//   "last_name": "Lawson",
//   "avatar": "https://reqres.in/img/faces/7-image.jpg"
// },
// {
//   "id": 8,
//   "email": "lindsay.ferguson@reqres.in",
//   "first_name": "Lindsay",
//   "last_name": "Ferguson",
//   "avatar": "https://reqres.in/img/faces/8-image.jpg"
// },
// {
//   "id": 9,
//   "email": "tobias.funke@reqres.in",
//   "first_name": "Tobias",
//   "last_name": "Funke",
//   "avatar": "https://reqres.in/img/faces/9-image.jpg"
// }
];
let idCounter = 0;

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
  });
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get("/api/v1/users", function(req, res) {
  const searchUsers = users.filter(user => {
    if (user.first_name.startsWith(req.query.search)||user.last_name.startsWith(req.query.search)){
      return user;
    }  
   })
  if (req.query.search){
    res.status(200).send(searchUsers);
  }
  else if (Object.keys(req.query).length === 0){
    res.status(200).send(users);
  }
  res.status(404).send();
});

app.get(`/api/v1/users/:id`, function(req, res){
  let found = false;  
  const getUserId = users.find(user => {
    if (req.params.id == user.id){
      found = true;
      return user;
    }
  })
  if(!isNaN(req.params.id)){
    if (!found){
      res.status(404).send();
    }
    res.status(200).send(getUserId);
  }
  else{
    res.status(400).send("ID must be a number");
  }
});

app.post('/api/v1/users', function (req, res) {
  const {email,first_name,last_name,avatar} = req.body;
  const found = users.some(user => user.first_name === first_name);
  
  if(found){
    res.status(409).send(`${first_name} already exists`);
  }
  else {
      idCounter++;  
      users.push({id: idCounter, first_name, last_name, email,avatar});
      res.status(201).send({id: idCounter});
    }
})

app.put('/api/v1/users/:id',function(req,res){
const {email,first_name,last_name,avatar} = req.body;
let check = false;
const reqId = req.params.id;

let findUser = users.find(user =>{
  if (user.id == reqId){
    check=true;
    return user;
  }
});

if(!isNaN(reqId)){
  let checkUserName = users.some(user => user.first_name === first_name);

  if(checkUserName){
    res.status(409).send(`${first_name} already exists`);
  }

  else if (check) {
    findUser.first_name = first_name;
    findUser.last_name = last_name;
    findUser.email = email;
    findUser.avatar = avatar;
    res.status(200).send(findUser);
  }
}

else{
  res.status(400).send("ID must be a number");
}
res.status(404).send();
})

app.delete('/api/v1/users/:id', function (req, res){
  let found = false
  if(!isNaN(req.params.id)){
    users.filter(user => {
      if (req.params.id == user.id){
        users.shift()
        res.status(200).send();
        found = true;
      }
    })
  }
  else{
    res.status(400).send("ID must be a number");
  }
  if (!found){
    res.status(404).send();
    }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
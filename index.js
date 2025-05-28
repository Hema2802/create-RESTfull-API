
const express = require('express');  // initilize express

const app = express(); // to run express for whole app

const PORT=5050;  // port number to run server

app.use(express.json()) // Middleware to parse JSON

function requestLogger(req, res, next) {
  const start = Date.now();

  // Wait for the response to finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next(); // Pass control to the next middleware or route handler
}

// Database replaced with array-user data

app.use(requestLogger);

let users=[
    {
        id:"1",
        firstName:"Hemalatha",
        lastName:"Thangavel",
        hobby:"Cooking"
    },
    {
        id:"2",
        firstName:"Mahalakshmi",
        lastName:"Karthick",
        hobby:"Reading Books"
    },
    {
        id:"3",
        firstName:"Anjali",
        lastName:"varun",
        hobby:"Writing Novels"
    },
    {
        id:"4",
        firstName:"Sangeetha",
        lastName:"Santhosh",
        hobby:"Teaching"
    },
    {
        id:"5",
        firstName:"Meenal",
        lastName:"Kulasekar",
        hobby:"Designing Cloths"
    },
]

//  1) GET /users–Fetch the list of all users.

// ---------Get all users------------

app.get('/users',(req,res)=>{
    // error message if the array is empty
    if (users.length === 0) {
        return res.status(200).json({ message: "No users found", data: [] });
    }
       res.status(200).json(users);
})

//2) ---------- GET specific user details----------

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id); // specific user details based on id
  if (!user) {  //if you entered wrong id
    return res.status(404).json({ error: 'Invalid id' });
  }
  res.status(200).json(user);  // result for correct id
});


// 3)-------- Add a new user details - POST method-----------

// Middleware to validate required fields for POST
function validateUserPost(req, res, next) {
  const { firstName, lastName, hobby } = req.body;
// all field should give to post 
  if (!firstName || !lastName || !hobby) {
    // error message
    return res.status(400).json({
      error: 'firstName, lastName, and hobby are required'
    });
  }

  next(); // Proceed to route handler if validation passes
}
app.post('/user',validateUserPost, (req, res) => {
  const newUser = {
    // to find continguous id and change integer to string
    id: (users.length + 1).toString(),
    ...req.body
  };
  users.push(newUser);  // push new user into users data
  res.status(201).json({
    message: 'User created successfully',    // message notification
    newUser: newUser,
    users: users
  });
});  


//-------------- PUT method for updation----------------

function validateUserPut(req, res, next) {
  const { firstName, lastName, hobby } = req.body;
  if (!firstName && !lastName && !hobby) {
    return res.status(400).json({ error: 'At least one field (firstName, lastName, or hobby) is required to update' });
  }
  next();
}

app.put('/user/:id',validateUserPut, (req, res) => {
    // finding id 
  const userIndex = users.findIndex(u => u.id === req.params.id);
//   error message 404
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
   // Merge existing user with new fields
  users[userIndex] = {
    ...users[userIndex], // existing user data
    ...req.body          // overwrite with provided fields
  };


//   updated message 
  res.status(200).json({   
    message: 'User updated successfully',
    updatedUser: users[userIndex],
    users: users
  });
});



// ----------DELETE request ----------------

app.delete('/user/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);   // id checking
  
  if (userIndex === -1) {    // error message
    return res.status(404).json({ error: 'User not found' });
  }

  const deletedUser = users.splice(userIndex, 1);   // deletes user at that index

//   dispay if successfully deleted the user details 
  res.status(200).json({
    message: 'User deleted',
    user: deletedUser[0],
    // shows remaining users data
    remainingUsers: users
  });
});



// test case

app.get('/',(req,res)=>{
    res.send("Hello from server")
})

// -----Start Server------
app.listen(PORT,()=>{
    console.log(`Server is connected with ${PORT} port`); // server connected message
})
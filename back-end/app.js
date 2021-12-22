const express = require('express');
const app = express();
const cors = require('cors'); //cross origin resource sharing
const dotenv = require('dotenv');

dotenv.config(); // we can access it when we need to
const dbService = require('./dbService');

app.use(cors()); //when we have an incomming api call it will block it and will be able to send data to our back-end
app.use(express.json()); //we able to send it in json format???what??
app.use(express.urlencoded({ extended: false })); //????

//create
app.post('/insert', (request, response) => {
  // console.log(request.body);
  const { Name, Author, Genere, Edition } = request.body;
  const db = dbService.getDbServiceInstance();
  const result = db.insertNewRow(Name, Author, Genere, Edition);
  result.then(data => response.json(data))
    .catch(err => console.log(err))
});
//read
app.get('/getAll', (request, response) => {
  const db = dbService.getDbServiceInstance();
  const result = db.getAllData();
  result.then(data => response.json({ data: data })).catch(err => console.log(err));
})

//update
app.patch('/update', (request, response) => {
  // console.log(request.body);
  const { Name, Author, Genere, Edition, Id } = request.body;
  const db = dbService.getDbServiceInstance();
  const result = db.updateRow(Name, Author, Genere, Edition, Id);
  result.then(data => response.json({ success: data }))
    .catch(err => console.log(err))
});

//delete
app.delete('/delete/:id', (request, response) => {
  const { id } = request.params;
  const db = dbService.getDbServiceInstance();
  const result = db.deleteRow(id);
  result.then(data => response.json({ success: data }))
    .catch(err => console.log(err))
})


app.listen(process.env.PORT, () => console.log('app is running'));


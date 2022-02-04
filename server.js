const express = require('express');
const app = express();
const cors = require('cors');
const UserService = require('./user.service');
require('dotenv').config();


app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(express.urlencoded({ extended: true }));
app.post('/api/users', async (req, res) => {
  const sUser = await new UserService();

  const user = 
    await sUser.User.findOne({username: req.body.username}) ||
    await sUser.createAndSaveUser(req.body.username)
  ;
  res.send({username: user.username, _id: user._id});
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

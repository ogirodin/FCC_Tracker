const express = require('express');
const app = express();
const cors = require('cors');
const UserService = require('./services/user.service');
const ExerciseService = require('./services/exercise.service');
require('dotenv').config();

let sUser;
let sExercise;
(async () => {
  sUser = await (new UserService()).init();
  sExercise = await (new ExerciseService()).init();
})();

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(express.urlencoded({ extended: true }));
app.post('/api/users', async (req, res) => {
  try {
    const user =
      await sUser.User.findOne({username: req.body.username}) ||
      await sUser.createAndSaveUser(req.body.username)
    ;
    res.send({username: user.username, _id: user._id});
  } catch (e) {
    console.log(e);
    throw e;
  }
});

app.post('/api/users/:id/exercises', async (req, res) => {
  try {
    const data = {
      user: req.params.id,
      date: new Date(),
      duration: req.body.duration,
      description: req.body.description,
    };
    const exercise = await sUser.addExercise(sExercise, data);
    let user = await sUser.User.findById(req.params.id).select('_id username');
    res.send({
      _id: req.params.id,
      username: user.username,
      date: exercise.date,
      description: exercise.description,
      duration: exercise.duration,
    });
  } catch(e) {
    console.log(e);
    throw e;
  }
});

app.get('/api/users/:id/logs', async (req, res) => {
  try {
    const user = await sUser.User.findById(req.params.id);
    res.send(user);
  } catch(e) {
    console.log(e);
    throw e;
  }
});

app.get('/api/users', async (req, res) => {
  try {
    res.send((await sUser.User.find()).map((v) => {
      return {_id: v._id, username: v.username};
    }));
  } catch(e) {
    console.log(e);
    throw e;
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

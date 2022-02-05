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
    // {"_id":"61fd5b15cbe88c34a5c3b519","username":"test_user","date":"Fri Feb 04 2022","duration":30,"description":"hello"}
    const data = {
      user: req.params.id,
      date: new Date(),
      duration: req.body.duration,
      description: req.body.description,
    };
    const exercise = await sUser.addExercise(sExercise, data);
    res.send(exercise);
  } catch(e) {
    console.log(e);
    throw e;
  }
});

app.get('/api/users/:id/logs', async (req, res) => {
  try {
    // {"_id":"61fd5b15cbe88c34a5c3b519","username":"test_user","date":"Fri Feb 04 2022","duration":30,"description":"hello"}
    const user = await sUser.User.findById(req.params.id);
    res.send(user);
  } catch(e) {
    console.log(e);
    throw e;
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

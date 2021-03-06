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

app.use((req, res, next) => {
  console.log(req.originalUrl);
  next();
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
      date: req.body.date
        ? (new Date(req.body.date)).toDateString()
        : (new Date()).toDateString()
      ,
      duration: req.body.duration,
      description: req.body.description,
    };
    const exercise = await sUser.addExercise(sExercise, data);
    let user = await sUser.User.findById(req.params.id).select('_id username');
    res.send({
      _id: req.params.id,
      username: user.username,
      date: exercise.date,
      duration: exercise.duration,
      description: exercise.description,
    });
  } catch(e) {
    console.log(e);
    throw e;
  }
});

app.get('/api/users/:id/logs', async (req, res) => {
  try {
    const user = await sUser.User.findById(req.params.id).populate('exercises');
    let oUser = user.toObject();
    oUser.log = oUser.exercises;
    delete oUser.exercises;

    if (req.query.from) {
      oUser.log = oUser.log.filter((v) => (
        new Date(v.date)).getTime() >= (new Date(req.query.from)).getTime()
      );
    }

    if (req.query.to) {
      oUser.log = oUser.log.filter((v) => (
        new Date(v.date)).getTime() <= (new Date(req.query.to)).getTime()
      );
    }

    if (req.query.limit) {
      oUser.log = oUser.log.splice(0, req.query.limit)
    }

    res.send({...oUser, count: oUser.log.length});
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

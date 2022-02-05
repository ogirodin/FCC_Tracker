const Singleton = require('../mongoose.connect');

class UserService {
  User = null;

  async init() {
    try {
      const mongoose = await Singleton.getInstance();
      const Schema = mongoose.Schema;
      const UserSchema = new mongoose.Schema({
        username: {
          type: String,
          required: true,
        },
        exercises: [{type: Schema.Types.ObjectId, ref: 'Exercise'}]
      }, {
        versionKey: false,
        collection: 'users'
      });

      // Compile model from schema
      this.User = mongoose.model('User', UserSchema);
      return this;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async createAndSaveUser(username) {
    try {
      const user = new this.User({username});
      return await user.save();
    } catch(err) {
      throw err;
    }
  };

  async addExercise(sExercise, data) {
    try {
      const exercise = await sExercise.createAndSaveExercise(data);
      await this.User.findByIdAndUpdate(data.user, {
        $push: {
          exercises: exercise
        }
      }, {new: true, useFindAndModify: false});
      return exercise;
    } catch(err) {
      throw err;
    }
  }
}


module.exports = UserService;

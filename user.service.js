const Singleton = require('./mongoose.connect');

class UserService {
  constructor() {
    this.updateSchema();
  }

  User = null;

  async updateSchema() {
    const mongoose = await (await Singleton.getInstance()).getConnection();

    const Schema = mongoose.Schema;

    const UserSchema = new mongoose.Schema({
        username: {
          type: String,
          required: true,
        }
    }, {
        versionKey: false,
        collection: 'users'
    });

    // Compile model from schema
    this.User = mongoose.model('User', UserSchema);
  }

  async createAndSaveUser(username) {
    const User = new this.User({username});
    try {
      return await User.save();
    } catch(err) {
      throw err;
    }
  };
}


module.exports = UserService;

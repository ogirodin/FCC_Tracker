const Singleton = require('../mongoose.connect');

class ExerciseService {
  Exercise = null;

  async init() {
    try {
      const mongoose = await Singleton.getInstance();
      const Schema = mongoose.Schema;
      const ExerciseSchema = new mongoose.Schema({
        user: { type: Schema.Types.ObjectId, ref: 'Person' },
        description: {type: String},
        duraction: {type: String},
        date: {type: String}
      }, {
        versionKey: false,
        collection: 'exercises'
      });

      // Compile model from schema
      this.Exercise = mongoose.model('Exercise', ExerciseSchema);
      return this;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async createAndSaveExercise(data) {
    try {
      return await new this.Exercise(data).save();
    } catch(err) {
      throw err;
    }
  };
}


module.exports = ExerciseService;

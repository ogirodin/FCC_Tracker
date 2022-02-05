const mongoose = require('mongoose');


var Singleton = (function() {
	function Constructeur() {
		let db = null;
    this.getConnection = async function() {
      try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
        return this.db = mongoose;
      } catch (e) {
        console.log(e);
        return e;
      }
    }
	}

	var instance = null;
	return new function() {
		this.getInstance = async () => {
			if (instance == null) {
				instance = await new Constructeur();
				await instance.getConnection();
				instance.contructeur = null;
			}

			return instance.db;
		}
	}
})();

module.exports = Singleton;

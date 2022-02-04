const mongoose = require('mongoose');


var Singleton = (function() {
	function constructeur() {
    this.getConnection = async function() {
      try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
        return mongoose;
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
				instance = await new constructeur();
				instance.constructeur = null;
			}
			
			return instance;
		}
	}
})();

module.exports = Singleton;
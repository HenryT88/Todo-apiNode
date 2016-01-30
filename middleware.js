var cryptojs = require('crypto-js');

module.exports = function(db){
	return{
		requireAuthentication : function(req, res, next){
			var token = req.get('Auth') || '';
			var str = [];
			db.token.findOne({
				where:{
					tokenHash: cryptojs.MD5(token).toString()
				}
			}).then(function(tokenInstance){
				if(!tokenInstance){
					str.push("Here it is - 1");
					throw new Error();
				}
				
				req.token = tokenInstance;
				return db.user.findByToken(token);
				
			}).then(function(user){
				req.user = user;
				next();
			}).catch(function(){
				res.status(401).send();
			});
			
		}
	};
};

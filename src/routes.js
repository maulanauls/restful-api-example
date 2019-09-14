let response = require("./config/response");
let users = require("./controllers/controllers.users");
let cdr = require("./controllers/controllers.cdr");
let activecall = require("./controllers/controllers.activecall");

async function routes(app, options) {

	//route index
	app.get("/", function(reply) {
		// res json
		response.notFound("Sorry, you cant access this area", reply);
	});

	// define get users
	app.post("/api/users/login", users.login);
	app.post("/api/users/settoken", users.settoken);
	app.get("/api/users", users.getAgent);
	app.get("/api/cdr/getdata", cdr.getCDR);
	app.get("/api/active-call/getdata", activecall.getActiveCall);
}

module.exports = routes;

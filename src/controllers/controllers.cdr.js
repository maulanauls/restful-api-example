let moment = require("moment");
let base64 = require("js-base64").Base64;
let response = require("../config/response");
let connection = require("../config/connection");
let access = require("../middleware/middleware.access");
let model = require("../models/model.cdr");
let jwt = require("jsonwebtoken");

async function getCDR(request, reply) {
	const key = await access.checkAccessKey(request, reply);
	if (key != undefined) {
		const authToken = await access.checkToken(request, reply);
		if (authToken != undefined) {
			let cdr = await model.getCDR(request, authToken.userAuth, reply);
			return response.success(cdr, authToken.token,`sukses`, reply);
		}
	}
}

module.exports = {
	getCDR
};

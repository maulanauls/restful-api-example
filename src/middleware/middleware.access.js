let response = require("../config/response");
let moment = require("moment");
let jwt = require("jsonwebtoken");
let base64 = require("js-base64").Base64;

async function checkAccessKey(request, reply) {
	let key = process.env.APP_SECRET_KEY;
	let sparator = "|";
	let now = moment()
		.format("YYYY-MM-DD")
		.toString();
	let allowkey = base64.encode(key + sparator + now);
	let accesskey = request.headers['access-key'];
	let result = true;

	console.log(accesskey);
	console.log(allowkey);

	if (allowkey != accesskey) {
		result = response.badAuth("Access key expired", reply);
	}

	return result;
}

async function checkToken(request, reply) {
	let authToken = request.headers["x-access-token"]; // express headers are auto converted to lowercase

	if (authToken !== "" && authToken.startsWith("Bearer ")) {
		authToken = authToken.slice(7, authToken.length);
		return jwt.verify(authToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
			if (err) {
				return response.badRequest("x-access-token not valid", reply);
			} else {
				let array = {
					userAuth: decoded,
					token: authToken
				}
				return array;
			}
		});
	} else {
		return response.badRequest("X-access-token not valid", reply);
	}
}

module.exports = {
	checkAccessKey,
	checkToken
};

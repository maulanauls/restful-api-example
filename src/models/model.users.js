let connection = require("../config/connection");
let response = require("../config/response");
let moment = require("moment");
let now = moment()
	.format("YYYY-MM-DD HH:mm:ss")
	.toString();

async function setToken(request, authToken, reply) {
	let updateArray = {
		token: request.body.token,
		updated_date: now
	};
	let SQL = "UPDATE M_users SET ? WHERE users_id = ?";
	let QueryActive = await new Promise(resolve =>
		connection.query(SQL, [updateArray, authToken.users_id], function(error, rows) {
			let result = {
					status: false,
					message: ""
				};
				if (error) {
					console.log(error);
					result.message = error;
					return resolve(result);
				} else {
					result.status = true;
					result.message = "Successfully Set Cloud Message";
					return resolve(result);
				}
		})
	);
	return QueryActive;
}

async function agentFetch(request, authToken, reply) {
	let SQL = "SELECT * FROM M_users where users_id = ?";
	let QueryActive = await new Promise(resolve =>
		connection.query(SQL, authToken.users_id, function(error, rows) {
			if (error) {
				console.log(error);
				return response.badRequest(`${error}`, reply);
			}

			if (rows.length > 0) {
				let obj;
				rows.forEach(element => {
					obj = element;
				});

				// if (obj.photo && obj.photo.substring(0, 4) != "http") {
				// 	obj.photo = process.env.APP_BASE_URL + obj.photo;
				// }

				return resolve(obj);
			} else {
				return resolve({});
			}
		})
	);
	return QueryActive;
}

module.exports = {
	agentFetch,
	setToken
};

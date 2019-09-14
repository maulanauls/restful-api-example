let moment = require("moment");
let base64 = require("js-base64").Base64;
let response = require("../config/response");
let connection = require("../config/connection");
let access = require("../middleware/middleware.access");
let model = require("../models/model.users");
let jwt = require("jsonwebtoken");

async function login(request, reply) {
	const key = await access.checkAccessKey(request, reply);
	if (key != undefined) {
		authAccess(request, "social", reply).then(res => {
			if (res != undefined) {
				if (res.status == false) {
					return response.badRequest(res.message, reply);
				} else {
					return response.success(res.data, res.data.token, `Successfully login!`, reply);
				}
			}
		});
	}
}

async function getAgent(request, reply) {
	const key = await access.checkAccessKey(request, reply);
	if (key != undefined) {
		const authToken = await access.checkToken(request, reply);
		if (authToken != undefined) {
			let users = await model.agentFetch(request, authToken.userAuth, reply);
			return response.success(users, authToken.token,`sukses`, reply);
		}
	}
}

async function settoken(request, reply) {
	const key = await access.checkAccessKey(request, reply);
	if (key != undefined) {
		const authToken = await access.checkToken(request, reply);
		if (authToken != undefined) {
			let users = await model.setToken(request, authToken.userAuth, reply);
			return response.success(users, authToken.token,`sukses`, reply);
		}
	}
}

async function authAccess(request, type, reply) {
	let email = request.body.email;

	const validation = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	if (type == "social") {
		let result = {
			status: false,
			message: "",
			data: {}
		};

		if (validation.test(email)) {
			sql = `SELECT * FROM M_users WHERE email = ?`;
		} else {
			return response.badRequest("error, this email is not valid", reply);
		}

		let users = await new Promise(resolve =>
			connection.query(sql, [email], function(error, rows) {
				if (error) {
					console.log(error);
					result.status = false;
					result.message = error;
					return resolve(result);
				} else {
					if (rows.length > 0) {
						const date = new Date();
						const token = jwt.sign(
							{
								users_id: rows[0].users_id,
								name: rows[0].name,
								email: rows[0].email
							},
							process.env.JWT_SECRET_KEY,
							{
								expiresIn: "7d" // expires in 7days
							}
						);
						userArray = {
							name: rows[0].name,
							email: rows[0].email,
							expires_in: date.setDate(date.getDate() + 7),
							token: token
						};

						result.status = true;
						result.data = userArray;
						result.message = "Successfully, login";
						return resolve(result);
					} else {
						result.status = false;
						result.message = "error, this email is not valid";
						return resolve(result);
					}
				}
			})
		);

		return users;
	} else if (type == "form") {
	}

	return users;
}

module.exports = {
	login,
	settoken,
	getAgent
};

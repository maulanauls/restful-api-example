let moment = require("moment");
let date_now = new Date();
const used = process.memoryUsage().heapUsed / 1024 / 1024;

async function success(data, token, message, reply) {
	
	const end = new Date() - date_now;
	const used = process.memoryUsage().heapUsed / 1024 / 1024;

	let loginStatus;
	
	if (token) {
		loginStatus = true;
	} else {
		loginStatus = false;
	}

	return reply
		.code(200)
		.header("Content-Type", "application/json; charset=utf-8")
		.send({
			diagnostic: {
				code: 200,
				elapsetime: end,
				memoryusage: Math.round(used * 100) / 100,
				unix_timestamp: moment().unix(),
				confirm: "success",
				message: message
			},
			results: data,
			output_type: "json",
			login_status: loginStatus
		});
}

// if request had bad syntax body or header
async function badRequest(message, reply) {
	const end = new Date() - date_now;

	return reply
		.code(400)
		.header("Content-Type", "application/json; charset=utf-8")
		.send({
			diagnostic: {
				code: 400,
				elapsetime: end,
				memoryusage: Math.round(used * 100) / 100 + " mb",
				unix_timestamp: moment().unix(),
				error_message: message
			},
			output_type: "json",
			login_status: false
		});
}

// if request authorization is false or null
async function badAuth(message, reply) {
    const end = new Date() - date_now;

	return reply
		.code(401)
		.header("Content-Type", "application/json; charset=utf-8")
		.send({
			diagnostic: {
				code: 401,
				elapsetime: end,
				memoryusage: Math.round(used * 100) / 100 + " mb",
				unix_timestamp: moment().unix(),
				error_message: message
			},
			output_type: "json",
			login_status: false
		});
}

async function forbidden(message, reply) {
    const end = new Date() - date_now;

	return reply
		.code(403)
		.header("Content-Type", "application/json; charset=utf-8")
		.send({
			diagnostic: {
				code: 403,
				elapsetime: end,
				memoryusage: Math.round(used * 100) / 100 + " mb",
				unix_timestamp: moment().unix(),
				error_message: message
			},
			output_type: "json",
			login_status: false
		});
}

async function notFound(message, reply) {
    const end = new Date() - date_now;

	return reply
		.code(404)
		.header("Content-Type", "application/json; charset=utf-8")
		.send({
			diagnostic: {
				code: 404,
				elapsetime: end,
				memoryusage: Math.round(used * 100) / 100 + " mb",
				unix_timestamp: moment().unix(),
				error_message: message
			},
			output_type: "json",
			login_status: false
		});
}

module.exports = {
	success,
	badRequest,
	badAuth,
	forbidden,
	notFound
};

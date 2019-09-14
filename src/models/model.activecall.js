let connection = require("../config/connection");
let response = require("../config/response");
let moment = require("moment");
let now = moment()
	.format("YYYY-MM-DD HH:mm:ss")
	.toString();
async function activeCall(request, authToken, reply) {
	let SQL = "SELECT * FROM M_activecalls";
	let QueryActive = await new Promise(resolve =>
		connection.query(SQL, function(error, rows) {
			if (error) {
				console.log(error);
				return response.badRequest(`${error}`, reply);
			}

			if (rows.length > 0) {
				return resolve(rows);
			} else {
				return resolve([]);
			}
		})
	);
	return QueryActive;
}

module.exports = {
	activeCall
};

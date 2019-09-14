let connection = require("../config/connection");
let response = require("../config/response");
let moment = require("moment");
let now = moment()
	.format("YYYY-MM-DD HH:mm:ss")
	.toString();
async function getCDR(request, authToken, reply) {
	let SQL = "SELECT * FROM M_cdr";
	let QueryActive = await new Promise(resolve =>
		connection.query(SQL, function(error, rows) {
			if (error) {
				console.log(error);
				return response.badRequest(`${error}`, reply);
			}

			if (rows.length > 0) {
				let array = [];

				rows.forEach(element => {
					array.push({
						uniqueid: element.uniqueid,
						did: element.did,
						clid: element.clid,
						channel: element.channel,
						incomingip: element.incomingip,
						codec: element.codec,
						duration: element.duration,
						disposition: element.disposition,
						dialstatus: element.dialstatus,
						errorcode: element.errorcode,
						sip_reason: element.sip_reason,
						created_date: moment(element.created_date)
							.format("YYYY-MM-DD HH:mm:ss")
							.toString(),
						starttime: moment(element.starttime)
							.format("YYYY-MM-DD HH:mm:ss")
							.toString(),
						endtime: moment(element.endtime)
							.format("YYYY-MM-DD HH:mm:ss")
							.toString()
					});
				});
				return resolve(array);
			} else {
				return resolve(false);
			}
		})
	);
	return QueryActive;
}

module.exports = {
	getCDR
};

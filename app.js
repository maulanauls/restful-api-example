	let http = require("http");
	let path = require("path");
	require("dotenv").config();

	const serverFactory = (handler, opts) => {
		const server = http.createServer((req, res) => {
			handler(req, res);
		});

		return server;
	};
	// try websocket
	const wssOptions = {
		maxPayload: 1048576, // we set the maximum allowed messages size to 1 MiB (1024 bytes * 1024 bytes)
		path: "/fastify", // we accept only connections matching this path e.g.: ws://localhost:8010/fastify
		verifyClient: function(info, next) {
			if (info.req.headers["x-fastify-header"] !== "fastify is awesome !") {
				return next(false); // the connection is not allowed
			}
			next(true); // the connection is allowed
		}
	};
	// end websockets
	// inisialisasi awal fastify.
	// const fastify = require("fastify")({
	// 	serverFactory,
	// 	trustProxy: true,
	// 	logger: { prettyPrint: true } //Aktifkan ini untuk menerima log setiap request dari fastify.
	// });
	const fastify = require("fastify")({
		serverFactory,
		trustProxy: true,
		bodyLimit: 9000000,
		logger: { prettyPrint: true } //Aktifkan ini untuk menerima log setiap request dari fastify.
	});

	// websocket try

	fastify.register(require("fastify-websocket"), {
		handle,
		options: wssOptions
	});

	function handle(conn) {
		conn.pipe(conn); // creates an echo server
	}

	//fungsi ini untuk membuat kita bisa megakses assets static di folder public
	fastify.register(require("fastify-static"), { root: path.join(__dirname, "/public") });

	//fungsi ini untuk membuat kita bisa melakuakn post melalui www-url-encoded.
	fastify.register(require("fastify-formbody"), {
		bodyLimit: 8234812
	});
	// fastify.register(require("fastify-formbody"));
	// file upload
	const fileUpload = require('fastify-file-upload')
	fastify.register(fileUpload);
	// fastify.register(require('fastify-multipart'));

	fastify.register(require("fastify-cors"), {
		// put your options here
		// allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token', 'accesskey'],
		origin: ["http://localhost:3000", "http://localhost"],
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		preflight: true,
		preflightContinue: false
	});

	//route yang dipisah dari root file.
	fastify.register(require("./src/routes"));

	//fungsi file root secara async.
	const start = async () => {
		try {
			//gunakan port dari ENV APP_PORT, kalo ngga ada variable tersebut maka akan menggunakan port 3000
			await fastify.listen(process.env.APP_PORT || 8020);
			fastify.ready();
			fastify.log.info(`server api listening on ${fastify.server.address().port}`);
		} catch (err) {
			fastify.log.error(err);
			process.exit(1);
		}
	};

	//jalankan server!
	start();

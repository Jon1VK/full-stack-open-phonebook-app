const morgan = require("morgan");

morgan.token("body", (req, res) =>
  req.method === "POST" ? JSON.stringify(req.body) : null
);

module.exports = morgan(
  ":method :url :status :res[content-length] - :response-time ms :body"
);

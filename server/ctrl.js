var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: '9648c58445df43a8b17bcf72c3464a74',
  captureUncaught: true,
  captureUnhandledRejections: true
});

module.exports = {
    createLineItem: (req, res) => {
        let body = req.body;
        console.log(body);
        rollbar.info(body);
        res.status(200).send(req.body);
    }
}

// app.use(rollbar.errorHandler());
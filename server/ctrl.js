require('dotenv').config();
const {DATABASE_URL} = process.env;

var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: '9648c58445df43a8b17bcf72c3464a74',
  captureUncaught: true,
  captureUnhandledRejections: true
});

const Sequelize = require("sequelize");
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false
    }
  }
});


module.exports = {
    createLineItem: (req, res) => {
        let body = req.body;
        console.log(body);
        rollbar.info(body);
        res.status(200).send(req.body);
    },

    getLineItems: (req, res) => {
      console.log('Backend Response');
      sequelize.query(`select *
        from invoice inv
        join item i on inv.inv_id = i.i_inv_id
      `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err));
      // res.status(200).send('Backend Response');
    }
}

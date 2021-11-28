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

    getInvoice: (req, res) => {
      const {id} = req.params;
      sequelize.query(`select *
        from invoice inv
        join item i on inv.inv_id = i.i_inv_id
        where inv_id = ${id};
      `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err));
    },

    getInvoiceList: (req, res) => {
      console.log('backend response');
      sequelize.query(`select * from invoice`)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err));
    },

    lastViewed: (req, res) => {
      console.log('getting last viewed');
      sequelize.query(`select inv_id
      from invoice
      order by viewed_at desc
      limit 1
      `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err));
    }
}

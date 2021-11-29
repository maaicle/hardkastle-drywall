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
        let {invId, description, costPer, quantity, unit, lineTotal} = req.body;
        sequelize.query(`insert into item (i_inv_id, i_description, i_cost, i_qty, i_unit, i_line_total)
        values (${invId}, '${description}', ${costPer}, ${quantity}, '${unit}', ${lineTotal});
        
        update invoice
        set inv_total = (
          select
          sum(i_line_total)
          from item
          where i_inv_id = ${invId}
        )
        where inv_id = ${invId}; 
        `)
          .then(dbRes => res.status(200).send('line item created'))
          .catch(err => console.log(err));
        // res.status(200).send(req.body);
    },

    getInvoice: (req, res) => {
      const {id} = req.params;
      sequelize.query(`select *
        from invoice inv
        left join item i on inv.inv_id = i.i_inv_id
        where inv_id = ${id};
      `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err));
    },

    getInvoiceList: (req, res) => {
      console.log('backend response');
      sequelize.query(`select * from invoice order by inv_id`)
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
    },

    putLastViewed: (req, res) => {
      const {id} = req.params;
      console.log('set last viewed');
      sequelize.query(`update invoice
      set viewed_at = now()
      where inv_id = ${id}`)
        .then(dbRes => res.status(200).send('Last Viewed Updated'))
        .catch(err => console.log(err));
    },

    createInvoice: (req, res) => {
      const {name} = req.params;
      console.log('createInvoice');
      sequelize.query(`insert into invoice (inv_name)
      values ('${name}')`)
        .then(dbRes => res.status(200).send('Invoice Created'))
        .catch(err => console.log(err));
    },

    deleteLine: (req, res) => {
      const {invId, itemId} = req.query;
      console.log(req.query);
      sequelize.query(`delete from item where i_id = ${itemId};

      update invoice
      set inv_total = (
        select
        sum(i_line_total)
        from item
        where i_inv_id = ${invId}
      )
      where inv_id = ${invId}; 
      `)
      .then(dbRes => res.status(200).send(dbRes))
      .catch(err => console.log(err));
    },

    deleteListItem: (req, res) => {
      sequelize.query(`delete from item where i_inv_id = ${+req.params.id};
        delete from invoice where inv_id = ${+req.params.id};
      `)
      .then(dbRes => res.status(200).send(dbRes))
      .catch(err => console.log(err));
    },

    updateName: (req, res) => {
      const {id, newName} = req.body;
      sequelize.query(`update invoice
      set inv_name = '${newName}'
      where inv_id = '${id}'; 
      `)
      .then(dbRes => res.status(200).send('name updated'))
      .catch(err => console.log(err));
    }

}

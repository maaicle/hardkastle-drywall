drop table if exists item;
drop table if exists invoice;

create table invoice (
  inv_id serial primary key,
  inv_name varchar(25),
  inv_total float(2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

create table item (
  i_id serial primary key,
  i_inv_id integer references invoice(inv_id),
  i_description varchar(100),
  i_cost float(2),
  i_qty float(2),
  i_unit varchar(25),
  i_line_total float(2)
);

insert into invoice (inv_name)
values ('First Invoice'),
('Second Invoice')
;

insert into item (i_inv_id, i_description, i_cost, i_qty, i_unit)
values (1, 'Nails', 5.50, 10, 'box'),
(1, 'Tape', 6, 6, 'roll'),
(1, 'Mud', 10, 2, 'bucket'),
(1, 'Sheetrock', 10, 10, 'sheet'),
(2, 'Nails', 5.50, 10, 'box'),
(2, 'Tape', 6, 6, 'roll'),
(2, 'Mud', 10, 2, 'bucket'),
(2, 'Sheetrock', 10, 10, 'sheet');

update item
set i_line_total = (i_cost * i_qty);

update invoice
set inv_total = (
  select
  sum(i_line_total)
  from item
  where i_inv_id = 1
)
where inv_id = 1;

update invoice
set inv_total = (
  select
  sum(i_line_total)
  from item
  where i_inv_id = 2
)
where inv_id = 2;


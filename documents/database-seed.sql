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
values ('Downtown'),
('Shed'),
('Library'),
('Delta Center'),
('Corporate Office')
;

insert into item (i_inv_id, i_description, i_cost, i_qty, i_unit)
values (1, 'Nails', 5.50, 10, 'box'),
(1, 'Tape', 6, 6, 'roll'),
(1, 'Mud', 10, 2, 'bucket'),
(1, 'Sheetrock', 10, 10, 'sheet'),
(2,	'Studs', 10, 30, '8 footers'),
(2,	'Wood Planks', 20, 20, '8 x 4'),
(2,	'Shingles',	15,	10,	'packs'),
(2,	'window', 100, 1, 'window'),
(2,	'nails', 5.5, 5, 'packs'),
(3,	'tables', 250, 10, 'table'),
(3,	'books', 5, 1000, 'book'),
(3,	'cards', 2.5, 100, 'pack'),
(3,	'shelves', 300, 10, 'shelf'),
(4,	'Basketballs', 15, 20, 'ball'),
(4,	'hoops', 250, 2, 'hoop'),
(4,	'jerseys', 100, 20, 'jersey'),
(5,	'office chairs', 200, 20, 'chair'),
(5,	'white boards',	100, 10, 'board')
;

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

update invoice
set inv_total = (
  select
  sum(i_line_total)
  from item
  where i_inv_id = 3
)
where inv_id = 3;

update invoice
set inv_total = (
  select
  sum(i_line_total)
  from item
  where i_inv_id = 4
)
where inv_id = 4;

update invoice
set inv_total = (
  select
  sum(i_line_total)
  from item
  where i_inv_id = 5
)
where inv_id = 5;


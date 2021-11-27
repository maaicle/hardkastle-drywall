drop table if exists item;
drop table if exists invoice;

create table invoice (
  inv_id serial primary key,
  inv_name varchar(25),
  inv_total float(2)
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
values ('First Invoice')
;

insert into item (i_inv_id, i_description, i_cost, i_qty, i_unit)
values ((select inv_id from invoice limit 1), 'Nails', 5.50, 10, 'box'),
((select inv_id from invoice limit 1), 'Tape', 6, 6, 'box'),
((select inv_id from invoice limit 1), 'Mud', 10, 2, 'box'),
((select inv_id from invoice limit 1), 'Sheetrock', 10, 10, 'box')

update item
set i_line_total = (i_cost * i_qty);

update invoice
set inv_total = (
  select
  sum(i_line_total)
  from item
  where i_inv_id = (select inv_id from invoice limit 1)
)

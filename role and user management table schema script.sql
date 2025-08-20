create table roles(
role_id serial primary key,
role_name varchar(50) unique not null
)

create table users(
user_id uuid primary key default gen_random_uuid(),
user_name varchar(50) unique not null,
password_hash text not null,
name varchar(150) not null,
email varchar(150) unique,
mob_no varchar(20) unique check (mob_no is null or mob_no ~ '^[0-9]{10}$'),
role_id int not null,
foreign key(role_id) references roles(role_id),
created_date timestamp default now(),
update_date timestamp default now()
)

select * from roles
select * from users

insert into roles(role_name) values('test')
insert into users(user_name,password_hash,name, role_id) 
values('test', 'setup@123','test',1)


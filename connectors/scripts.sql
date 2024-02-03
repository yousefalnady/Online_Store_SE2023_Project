-- don't forget to create scheme "projectSE"
-- if you want to recreate your tables then perform
-- query in the same order as below

drop table if exists "projectSE"."Session";
drop table if exists "projectSE"."Cart";
drop table if exists "projectSE"."ProductOrder";
drop table if exists "projectSE"."Order";
drop table if exists "projectSE"."Product";
drop table if exists "projectSE"."User";

create table if not exists "projectSE"."User"
(
    "id" serial primary key,
    "name" text not null,
    "country" text not null,
    "phoneNumber" text not null,
    "address" text not null,
    "birthDate" date not null,
    "email" text not null,
    "password" text not null,
    "role" text not null default 'customer'
);

create table if not exists "projectSE"."Session"
(
    "id" serial primary key,
    "userId" integer not null,
    "token" text not null,
    "expiresAt" timestamp not null,
    foreign key("userId") references "projectSE"."User"(id)
);

create table if not exists "projectSE"."Order"
(
    "id" serial primary key,
    "userId" integer not null,
    "date" date not null default current_timestamp,
    foreign key("userId") references "projectSE"."User"(id)
);

create table if not exists "projectSE"."Product"
(
    "id" serial primary key,
    "name" text not null,
    "quantity" integer not null default 1,
    "rating" integer not null default 5, 
    "category" text not null,
    "description" text not null,
    "hidden" boolean not null default false,
    "createdAt" date default current_timestamp,
    "ownerId" integer not null,
    foreign key("ownerId") references "projectSE"."User"(id) 
);


create table if not exists "projectSE"."Cart"
(
    "id" serial primary key,
    "userId" integer not null,
    "productId" integer not null,
    "quantity" integer not null default 1,
    foreign key("userId") references "projectSE"."User"(id),
    foreign key("productId") references "projectSE"."Product"(id)

);
create table if not exists "projectSE"."ProductOrder"
(
    "orderID" integer not null,
    "productID" integer not null,
    foreign key("orderID") references "projectSE"."Order"(id),
    foreign key("productID") references "projectSE"."Product"(id),
    primary key("orderID" , "productID") 

);



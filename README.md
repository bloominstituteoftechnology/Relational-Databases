# Relational Databases and PostgreSQL

## What is a relational database?

Data stored as row records in tables. Imagine a spreadsheet with column
headers describing the contents of each column, and each row is a
record.

Records are related to those in different tables through common fields
that are present in both tables.

For example, an `Employee` table might have the following fields in each
record:

    Employee
        EmployeeID
        FirstName
        LastName
        DepartmentID

And a `Department` table might have the following fields in each record:

    Department
        DepartmentID
        DepartmentName

Notice that both `Employee` and `Department` have a `DepartmentID`
field. This common field *relates* the two tables and can be used to
*join* them together with a *query*.


Compare to NoSQL databases that work with key/value pairs or are document stores.

* [Relational Database at Wikipedia](https://en.wikipedia.org/wiki/Relational_database)
* [Non-relational (NoSQL) databases at Wikipedia](https://en.wikipedia.org/wiki/NoSQL)


## PostgreSQL

PostgreSQL is a venerable relational database that is freely available
and world-class.

https://www.postgresql.org/

## Assignment: Install PostgreSQL

**IMPORTANT!** These instructions assume you haven't already installed
PostgreSQL. If you have already installed it, skip this section or
Google for how to upgrade your installation.

### Mac with Homebrew

1. Open a terminal
2. Install PostgreSQL: `brew install postgresql`
3. Start the database process
    * If you want to start it every time you log in, run:

          brew services start postgresql

    * If you want to just start it one time right now, run:

          pg_ctl -D /usr/local/var/postgres start

4. Create a database named the same as your username: `createdb $(whoami)`
    * Optionally you can call it anything you want, but the shell
      defaults to looking for a database named the same as your user.

Then start a shell by running `psql` and see if it works. You should see
this prompt:

    $ psql
    psql (10.1)
    Type "help" for help.

    beejtestdb=> 

(Use `psql databasename` if you created the database under something
other than your username.)

You can enter `\q` to exit the shell.


### Arch Linux

Arch requires a bit more hands-on, but not much more. Check this out if
you want to see a different Unix-y install procedure (or if you run
Arch).

* [Installing PostgreSQL on Arch
  Linux](https://wiki.archlinux.org/index.php/PostgreSQL)

## SQL, Structured Query Language

SQL ("sequel") is the language that people use for interfacing with
relational databases.

TODO
* Lecture:
    * SQL
        * create table
        * create rows, INSERT
        * read rows, SELECT
        * update rows, UPDATE
        * delete rows, DELETE

    * Transactions
        * Not all DBs have them

* Assignment:
    * create table
    * CRUD

* Lecture:
    * CRUD
    * ACID
    * Normalization
        * Normal forms overview
        * Anomalies
        * https://www.essentialsql.com/get-ready-to-learn-sql-database-normalization-explained-in-simple-english/
        * https://support.microsoft.com/en-us/help/283878/description-of-the-database-normalization-basics 
        * https://en.wikipedia.org/wiki/Database_normalization (Dense)

    * Joins
        * Inner
        * Outer--left, right, full
        * https://www.w3schools.com/sql/sql_join.asp
        * https://en.wikipedia.org/wiki/Join_(SQL)
        * Foreign Keys

    * Node Postgres
        * https://node-postgres.com/
        * https://github.com/brianc/node-postgres

* Assignment:
    * Load data into DB
    * Command line query tool
    * ExpressJS query tool
    * RESTful API

* Other RDBS: MySQL, Sqlite

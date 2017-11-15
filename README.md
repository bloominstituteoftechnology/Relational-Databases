# Relational Databases and PostgreSQL

## What is a relational database?

Data stored as row records in tables. Imagine a spreadsheet with column
headers describing the contents of each field, and each row is a
record.

A database can contain many tables. A table can contain many rows. A row
can contain many fields.

Records are related to those in different tables through common fields
that are present in both tables.

For example, an `Employee` table might have the following fields in each
record:

    Employee
        EmployeeID  FirstName  LastName  DepartmentID

And a `Department` table might have the following fields in each record:

    Department
        DepartmentID  DepartmentName

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

* [Assignment: Install PostgreSQL](#assignment-install-postgresql)

## SQL, Structured Query Language

SQL ("sequel") is the language that people use for interfacing with
relational databases.

### Create a table with CREATE TABLE

A database is made up of a number of tables. Let's create a table using
SQL in the shell. Be sure to end the command with a semicolon `;`.

(Note: SQL commands are often capitalized by convention, but can be
lowercase.)


    $ psql
    psql (10.1)
    Type "help" for help.

    dbname=> CREATE TABLE Employee (ID INT, LastName VARCHAR(20));

Use the `\dt` command to show which tables exist:

    dbname=> CREATE TABLE Employee (ID INT, LastName VARCHAR(20));
    CREATE TABLE
    dbname=> \dt
            List of relations
    Schema |   Name   | Type  | Owner 
    --------+----------+-------+-------
    public | employee | table | beej
    (1 row)

Use the `\d` command to see what columns a table has:

    dbname=> \d Employee
                            Table "public.employee"
        Column    |         Type          | Collation | Nullable | Default 
    --------------+-----------------------+-----------+----------+---------
     id           | integer               |           |          | 
     lastname     | character varying(20) |           |          | 

### Create a row with INSERT

    dbname=> INSERT INTO Employee (ID, LastName) VALUES (10, 'Tanngnjostr');
    INSERT 0 1

You can omit the column names if you're putting data in every column:

    dbname=> INSERT INTO Employee VALUES (10, 'Tanngnjostr');
    INSERT 0 1

Run some more inserts into the table:

    INSERT INTO Employee VALUES (11, 'Alice');
    INSERT INTO Employee VALUES (12, 'Bob');
    INSERT INTO Employee VALUES (13, 'Charlie');
    INSERT INTO Employee VALUES (14, 'Dave');
    INSERT INTO Employee VALUES (15, 'Eve');

### Read rows with SELECT

You can query the table with `SELECT`.

Query all the rows and columnts:

    dbname=> SELECT * FROM Employee;
     id |  lastname   
    ----+-------------
     10 | Tanngnjostr
     11 | Alice
     12 | Bob
     13 | Charlie
     14 | Dave
     15 | Eve
    (6 rows)

With SELECT, `*` means "all columns".

You can choose specific columns:

    dbname=> SELECT LastName FROM Employee;
      lastname   
    -------------
     Tanngnjostr
     Alice
     Bob
     Charlie
     Dave
     Eve
    (6 rows)

And you can search for specific rows with the `WHERE` clause:

    dbname=> SELECT * FROM Employee WHERE ID=12;
     id | lastname 
    ----+----------
     12 | Bob
    (1 row)

    dbname=> SELECT * FROM Employee WHERE ID=14 OR LastName='Bob';
     id | lastname 
    ----+----------
     12 | Bob
     14 | Dave
    (2 rows)


### Update rows with UPDATE

The `UPDATE` command can update one or many rows. Restrict which rows
are updated with a `WHERE` clause.`

    dbname=> UPDATE Employee SET LastName='Harvey' WHERE ID=10;
    UPDATE 1

    dbname=> SELECT * FROM Employee WHERE ID=10;
     id | lastname 
    ----+----------
     10 | Harvey
    (1 row)

You can update multiple columns at once:

    dbname=> UPDATE Employee SET LastName='Octothorpe', ID=99 WHERE ID=14;
    UPDATE 1


### Delete rows with DELETE

Delete from a table with the `DELETE` command. Use a `WHERE` clause to
restrict the delete.

**CAUTION!** If you don't use a `WHERE` clause, all rows will be deleted
from the table!

Delete some rows:

    dbname=> DELETE FROM Employee WHERE ID >= 15;
    DELETE 2

Delete **ALL** rows (*Danger, Will Robinson!*):

    dbname=> DELETE FROM Employee;
    DELETE 4

### Deleting entire tables with DROP

If you want to get rid of an entire table, use `DROP`.

**WARNING!** There is no going back. Table will be completely blown
away. Destroyed ...by the Empire.

    dbname=> DROP TABLE Employee;
    DROP TABLE

* [Assignment: Create a Table and Use It](#assignment-create-a-table-and-use-it)
  
## ACID and CRUD

These are two common database terms.

### ACID

Short for *Atomicity*, *Consistency*, *Isolation*, *Durability*. When
people mention "ACID-compliance", they're generally talking about the
ability of the database to accurately record transactions in the case of
crash or power failure.

Atomicity: all transactions will be "all or nothing".

Consistency: all transactions will leave the database in a consistent
state with all its defined rules and constraints.

Isonlation: the results of concurrent transactions is the same as if
those transactions had been executed sequentially.

Durability: Once a transaction is committed, it will remain committed,
despite crashes, power outages, snow, and sleet.

### CRUD

Short for *Create*, *Read*, *Update*, *Delete*. Describes the four basic
functions of a data store.

In a relational database, these functions are handled by `INSERT`,
`SELECT`, `UPDATE`, and `DELETE`.

## NULL and NOT NULL

Columns in records can sometimes have no data, referred to by the
special keyword as `NULL`. Sometimes it makes sense to have NULL fields,
and sometimes it doesn't.

If you explicitly want to disallow NULL fields in your table, you can
create the fields with the `NOT NULL` constraint:

    CREATE TABLE Employee (
        ID INT NOT NULL,
        LastName VARCHAR(20));

## Keys, Primary, Foreign, and Composite

### Primary Key

Rows in a table often have one column that is called the *primary key*.
The value in this column applies to all the rest of the data in the
record. For example, an `EmployeeID` would be a great primary key,
assuming the rest of the record held employee information.

    Employee
        ID (Primary Key)  LastName  FirstName  DepartmentID

To create a table and specify the primary key, use the `NOT NULL` and
`PRIMARY KEY` constraints:

    CREATE TABLE Employee (
        ID INT NOT NULL PRIMARY KEY,
        LastName VARCHAR(20),
        FirstName VARCHAR(20),
        DepartmentID INT);

You can always search quickly by primary key.

### Foreign Keys

If a key refers to a primary key in another table, it is called a
*foreign key* (abbreviated "FK"). You are not allowed to make changes to
the database that would cause the foreign key to refer to a non-existent
record.

The database uses this to maintain *referential integrity*.

Create a foreign key using the `REFERENCES` constraint. It specifies the
remote table and column the key refers to.

    CREATE TABLE Department (
        ID INT NOT NULL PRIMARY KEY,
        Name VARCHAR(20));

    CREATE TABLE Employee (
        ID INT NOT NULL PRIMARY KEY,
        LastName VARCHAR(20),
        FirstName VARCHAR(20),
        DepartmentID INT REFERENCES Department(ID));

In the above example, you cannot add a row to `Employee` until that
`DepartmentID` already exists in `Department`'s `ID`.

Also, you cannot delete a row from `Department` if that row's `ID` was a
`DepartmentID` in `Employee`.

### Composite Keys

Keys can also consist of more than one column. *Composite keys* can be
created as follows:

    CREATE TABLE example (
        a INT,
        b INT,
        c INT,
        PRIMARY KEY (a, c));

## Indexes

When searching through tables, you use a `WHERE` clause to narrow things down. For speed, the columns mentioned in the `WHERE` clause should either be a primary key, or a column for which an *index* has been built.

Indexes help speed searches. In a large table, searching over an unindexed column will be *slow*.

Example of creating an index on the Employee table from the
[Keys](#keys-primary-and-foreign) section:

    dbname=> CREATE INDEX ON Employee (LastName);
    CREATE INDEX

    dbname=> \d Employee
                            Table "public.employee"
        Column    |         Type          | Collation | Nullable | Default 
    --------------+-----------------------+-----------+----------+---------
     id           | integer               |           | not null | 
     lastname     | character varying(20) |           |          | 
     firstname    | character varying(20) |           |          | 
     departmentid | integer               |           |          | 
    Indexes:
        "employee_pkey" PRIMARY KEY, btree (id)
        "employee_lastname_idx" btree (lastname)
    Foreign-key constraints:
        "employee_departmentid_fkey" FOREIGN KEY (departmentid) REFERENCES department(id)

* [PostgreSQL CREATE INDEX documentation](https://www.postgresql.org/docs/current/static/sql-createindex.html)


## Transactions

In PostgreSQL, you can bundle a series of statements into a
*transaction*. The transaction is executed *atomically*, which means
either the entire transaction occurs, or none of the transaction occurs.
There will never be a case where a transaction partially occurs.

Create a transaction by starting with a `BEGIN` statement, followed by
all the statements that are to be within the transaction.

To execute the transaction ("Let's do it!"), end with a `COMMIT`
statement.

To abort the transaction and do nothing ("On second thought,
nevermind!") end with a `ROLLBACK` statement. *This makes it like
nothing within the transaction ever happened.*

Usually transactions happen within a program that checks for sanity and
either commits or rolls back.

Pseudocode making DB calls that check if a rollback is necessary:

    db("BEGIN"); // Begin transaction

    db("UPDATE accounts SET balance = balance - 100.00
        WHERE name = 'Alice'");

    balance = db("SELECT balance WHERE name = 'Alice'");

    // Don't let the balance go below zero:
    if (balance < 0) {
        db("ROLLBACK"); // Never mind!! Roll it all back.
    } else {
        db("COMMIT"); // Plenty of cash
    }
    
In the above example, the `UPDATE` and `SELECT` must happen at the same
time (*atomically*) or else another process could sneak in between and
withdraw too much money. Because it needs to be atomic, it's wrapped in
a transaction.

If you just enter a single SQL statement that is not inside a `BEGIN`
transaction block, it gets automatically wrapped in a `BEGIN`/`COMMIT`
block. It is a mini transaction that is `COMMIT`ted immediately.

Not all SQL databases support transactions, but most do.


## The EXPLAIN Command

The `EXPLAIN` command will tell you how much time the database is
spending doing a query, and what it's doing in that time.

It's a powerful command that can help tell you where you need to add
indexes, change structure, or rewrite queries.

    dbname=> EXPLAIN SELECT * FROM foo;
    
                           QUERY PLAN
    ---------------------------------------------------------
     Seq Scan on foo  (cost=0.00..155.00 rows=10000 width=4)
    (1 row)

For more information, see the [PostgreSQL EXPLAIN documentation](https://www.postgresql.org/docs/current/static/sql-explain.html)


## Normalization and Normal Forms

*[This topic is very deep and this section cannot do it full justice.]*

*Normalization* is the process of designing or refactoring your tables
for maximum consistency and minimum redundancy.

With NoSQL databases, we're used to *denormalized* data that is stored
with speed in mind, and not so much consistency (sometimes NoSQL databases talk about *eventual consistency*).

Non-normalized tables are considered an anti-pattern in relational databases.

There are many *normal forms*. We'll talk about First, Second, and Third
normal forms.

### First Normal Form (1NF)

When a database is in first normal form, there is a primary key for each
row, and there are no repeating sets of columns that should be in their
own table.

Unnormalized (column titles on separate lines for clarity):

    Farm
        ID
        AnimalName1  AnimalBreed1  AnimalProducesEggs1
        AnimalName2  AnimalBreed2  AnimalProducesEggs2

1NF:

    Farm
        ID

    Animal
        ID  FarmID[FK Farm(ID)]  Name  Breed  ProducesEggs


Use a *join* [TODO make link] to select all the animals in the farm:

    SELECT Name FROM Animal, Farm WHERE Farm.ID = Animal.FarmID;

TODO: verify above SQL

### Second Normal Form (2NF)

To be in 2NF, a table must already be in 1NF.

Additionally, all non-key data must fully relate to the key data in the table.

In the farm example, above, Animal has a Name and a key FarmID, but
these two pieces of information are not related.

We can fix this by adding a table to link the other two tables together:

2NF:

    Farm
        ID

    FarmAnimal
        FarmID[FK Farm(ID)]  AnimalID[FK Animal(ID)]

    Animal
        ID  Name  Breed  ProducesEggs

Use a *join* [TODO make link] to select all the animals in the farm:

    SELECT Name FROM Animal, FarmAnimal, Farm
        WHERE Farm.ID = FarmAnimal.FarmID AND
              Animal.ID = FarmAnimal.AnimalID;

TODO: verify above SQL


### Third Normal Form (3NF)

A table in 3NF must already be in 2NF.

Additionally, columns that relate to each other AND to the key need to
be moved into their own tables. This is known as removing *transitive
dependencies*.

In the Farm example, the fields `Breed` and `ProducesEggs` are related.
If you know the breed, you automatically know if it produces eggs or
not.

3NF:

    Farm
        ID

    FarmAnimal
        FarmID[FK Farm(ID)]  AnimalID[FK Animal(ID)]

    BreedEggs
        Breed  ProducesEggs

    Animal
        ID  Name  Breed[FK BreedEggs(Breed)]

Use a *join* [TODO make link] to select all the animals names that
produce eggs in the farm:

    SELECT Name FROM Animal, FarmAnimal, BreedEggs, Farm
        WHERE Farm.ID = FarmAnimal.FarmID AND
              Animal.ID = FarmAnimal.AnimalID AND
              Animal.Breed = BreedEggs.Breed AND
              BreedEggs.ProducesEggs = TRUE;

TODO Verify above SQL

# TODO

* EXPLAIN

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

   This database will contain tables.

Then start a shell by running `psql` and see if it works. You should see
this prompt:

    $ psql
    psql (10.1)
    Type "help" for help.

    dbname=> 

(Use `psql databasename` if you created the database under something
other than your username.)

Use `\l` to get a list of databases.

You can enter `\q` to exit the shell.


### Arch Linux

Arch requires a bit more hands-on, but not much more. Check this out if
you want to see a different Unix-y install procedure (or if you run
Arch).

* [Installing PostgreSQL on Arch
  Linux](https://wiki.archlinux.org/index.php/PostgreSQL)


## Assignment: Create a Table and Use It

Launch the shell on your database, and create a table.

    CREATE TABLE Employee (ID INT, FirstName VARCHAR(20), LastName VARCHAR(20));

Insert some records:

    INSERT INTO Employee VALUES (1, 'Alpha', 'Alphason');
    INSERT INTO Employee VALUES (2, 'Bravo', 'Bravoson');
    INSERT INTO Employee VALUES (3, 'Charlie', 'Charleson');
    INSERT INTO Employee VALUES (4, 'Delta', 'Deltason');
    INSERT INTO Employee VALUES (5, 'Echo', 'Ecoson');

Select all records:

    SELECT * FROM Employee;

Select Employee #3's record:

    SELECT * FROM Employee WHERE ID=3;

Delete Employee #3's record:

    DELETE FROM Employee WHERE ID=3;
 
Use `SELECT` to verify the record is deleted.

Update Employee #2's name to be "Foxtrot Foxtrotson":

    UPDATE Employee SET FirstName='Foxtrot', LastName='Foxtrotson' WHERE ID=2;

Use `SELECT` to verify the update.

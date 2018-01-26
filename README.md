# Relational Databases and PostgreSQL


## Contents

* [What is a relational database?](#what-is-a-relational-database)
* [Relational vs NoSQL](#relational-vs-nosql)
* [PostgreSQL](#postgresql)
* [SQL, Structured Query Language](#sql-structured-query-language)
* [Column Data Types](#column-data-types)
* [ACID and CRUD](#acid-and-crud)
* [NULL and NOT NULL](#null-and-not-null)
* [COUNT](#count)
* [ORDER BY](#order-by)
* [GROUP BY](#group-by)
* [Keys: Primary, Foreign, and Composite](#keys-primary-foreign-and-composite)
* [Auto-increment Columns](#auto-increment-columns)
* [Joins](#joins)
* [Indexes](#indexes)
* [Transactions](#transactions)
* [The EXPLAIN Command](#the-explain-command)
* [Quick and Dirty DB Design](#quick-and-dirty-db-design)
* [Normalization and Normal Forms](#normalization-and-normal-forms)
* [Node-Postgres](#node-postgres)
* [Security](#security)
* [Other Relational Databases](#other-relational-databases)
* [Assignment: Install PostgreSQL](#assignment-install-postgresql)
* [Assignment: Create a Table and Use It](#assignment-create-a-table-and-use-it)
* [Assignment: NodeJS Program to Create and Populate a Table](#assignment-nodejs-program-to-create-and-populate-a-table)
* [Assignment: Command-line Earthquake Query Tool](#assignment-command-line-earthquake-query-tool)
* [Assignment: RESTful Earthquake Data Server](#assignment-restful-earthquake-data-server)


## What is a relational database?

Data stored as row records in tables. Imagine a spreadsheet with column
headers describing the contents of each column, and each row is a
record.

A database can contain many tables. A table can contain many rows. A row
can contain many columns.

Records are related to those in different tables through common columns
that are present in both tables.

For example, an `Employee` table might have the following columns in
each record:

    Employee
        EmployeeID  FirstName  LastName  DepartmentID

And a `Department` table might have the following columns in each
record:

    Department
        DepartmentID  DepartmentName

Notice that both `Employee` and `Department` have a `DepartmentID`
column. This common column *relates* the two tables and can be used to
*join* them together with a *query*.

The structure described by the table definitions is known as the
*schema*.

Compare to NoSQL databases that work with key/value pairs or are
document stores.

* [Relational Database at Wikipedia](https://en.wikipedia.org/wiki/Relational_database)
* [Non-relational (NoSQL) databases at Wikipedia](https://en.wikipedia.org/wiki/NoSQL)


## Relational vs NoSQL

*NoSQL* is a term that refers to non-relational databases, most usually
document store databases. (Though it can apply to almost any kind of
non-relational database.)

MongoDB is a great example of a NoSQL database.

### When Do You Use NoSQL Versus a Relational Database?

Unfortunately, there are no definitive rules on when to choose one or
the other.

Do you need ACID-compliance? Consider a relational database.

Does your schema (structure of data) change frequently? Consider NoSQL.

Does absolute consistency in your data matter, e.g. a bank, inventory
management system, employee management, academic records, etc.? Consider
a relational database.

Do you need easy-to-deploy high-availability? Consider NoSQL.

Do you need transactions to happen atomically? (The ability to update
multiple records simultaneously?) Consider a relational database.

Do you need read-only access to piles of data? Consider NoSQL.


## PostgreSQL

PostgreSQL is a venerable relational database that is freely available
and world-class.

https://www.postgresql.org/

* **Assignment:** [Install PostgreSQL](#assignment-install-postgresql)


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

```sql
INSERT INTO Employee VALUES (11, 'Alice');
INSERT INTO Employee VALUES (12, 'Bob');
INSERT INTO Employee VALUES (13, 'Charlie');
INSERT INTO Employee VALUES (14, 'Dave');
INSERT INTO Employee VALUES (15, 'Eve');
```

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

With `SELECT`, `*` means "all columns".

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

Finally, you can rename the output columns, if you wish:

```sql
SELECT id AS Employee ID, LastName AS Name
    FROM Employee
    WHERE ID=14 OR LastName='Bob';
    
 Employee ID | Name 
-------------+----------
     12      | Bob
     14      | Dave
```

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

* **Assignment:** [Create a Table and Use It](#assignment-create-a-table-and-use-it)
  

## The `WHERE` Clause

You've already seen some examples of how `WHERE` affects `SELECT`,
`UPDATE`, and `DELETE`.

Normal operators like `<`, `>`, `=`, `<=`, `>=` are available.

For example:

```sql
SELECT * from animals
    WHERE age >= 10;
```

### `AND`, `OR`, and Parentheses

You can add more boolean logic with `AND`, `OR`, and affect precedence
with parentheses:

```sql
SELECT * from animals
    WHERE age >= 10 AND type = 'goat';
```

```sql
SELECT * from animals
    WHERE age >= 10 AND (type = 'goat' OR type = 'antelope');
```

### `LIKE`

The `LIKE` operator can be used to do pattern matching.

```sql
_   -- Match any single character
%   -- Match any sequence of characters
```

To select all animals that start with `ab`:

```sql
SELECT * from animal
    WHERE name LIKE 'ab%';
```


## Column Data Types

You probably noticed a few data types we specified with `CREATE TABLE`,
above. PostgreSQL has [a lot of data
types](https://www.postgresql.org/docs/current/static/datatype.html).

This is an incomplete list of some of the more common types:

```sql
VARCHAR(n)   -- Variable character string of max length n
BOOLEAN      -- TRUE or FALSE
INTEGER      -- Integer value
INT          -- Same as INTEGER
DECIMAL(p,s) -- Decimal number with p digits of precision
             -- and s digits right of the decimal point
REAL         -- Floating point number
DATE         -- Holds a date
TIME         -- Holds a time
TIMESTAMP    -- Holds an instant of time (date and time)
BLOB         -- Binary object
```

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
special keyword as `NULL`. Sometimes it makes sense to have NULL
columns, and sometimes it doesn't.

If you explicitly want to disallow NULL columns in your table, you can
create the columns with the `NOT NULL` constraint:

    CREATE TABLE Employee (
        ID INT NOT NULL,
        LastName VARCHAR(20));


## COUNT

You can select a count of items in question with the `COUNT` operator.

For example, count the rows filtered by the `WHERE` clause:

```sql
SELECT COUNT(*) FROM Animals WHERE legcount >= 4;

 count 
-------
     5
```

Useful with [`GROUP BY`](#group-by), below.


## ORDER BY

`ORDER BY` which sorts `SELECT` results for you. Use `DESC` to sort in
reverse order.

```sql
SELECT * FROM Pets
ORDER BY age DESC;

  name     | age 
-----------+-----
 Rover     |   9
 Zaphod    |   4
 Mittens   |   3
```


## GROUP BY

When used with an aggregating function like [`COUNT`](#count), can be
used to produce groups of results.

Count all the customers in certain countries:

```sql
SELECT COUNT(CustomerID), Country
    FROM Customers
    GROUP BY Country;

  COUNT(CustomerID)   |  Country 
----------------------+-----------
      1123            |    USA
       734            |    Germany
                     etc.
```


## Keys: Primary, Foreign, and Composite

### Primary Key

Rows in a table often have one column that is called the *primary key*.
The value in this column applies to all the rest of the data in the
record. For example, an `EmployeeID` would be a great primary key,
assuming the rest of the record held employee information.

    Employee
        ID (Primary Key)  LastName  FirstName  DepartmentID

To create a table and specify the primary key, use the `NOT NULL` and
`PRIMARY KEY` constraints:

```sql
CREATE TABLE Employee (
    ID INT NOT NULL PRIMARY KEY,
    LastName VARCHAR(20),
    FirstName VARCHAR(20),
    DepartmentID INT);
```

You can always search quickly by primary key.

### Foreign Keys

If a key refers to a primary key in another table, it is called a
*foreign key* (abbreviated "FK"). You are not allowed to make changes to
the database that would cause the foreign key to refer to a non-existent
record.

The database uses this to maintain *referential integrity*.

Create a foreign key using the `REFERENCES` constraint. It specifies the
remote table and column the key refers to.

```sql
CREATE TABLE Department (
    ID INT NOT NULL PRIMARY KEY,
    Name VARCHAR(20));

CREATE TABLE Employee (
    ID INT NOT NULL PRIMARY KEY,
    LastName VARCHAR(20),
    FirstName VARCHAR(20),
    DepartmentID INT REFERENCES Department(ID));
```

In the above example, you cannot add a row to `Employee` until that
`DepartmentID` already exists in `Department`'s `ID`.

Also, you cannot delete a row from `Department` if that row's `ID` was a
`DepartmentID` in `Employee`.

### Composite Keys

Keys can also consist of more than one column. *Composite keys* can be
created as follows:

```sql
CREATE TABLE example (
    a INT,
    b INT,
    c INT,
    PRIMARY KEY (a, c));
```


## Auto-increment Columns

These are columns that the database manages, usually in an
ever-increasing sequence. It's perfect for generation unique, numeric
IDs for primary Keys.

> In some databases (e.g MySQL) this is done with an `AUTO_INCREMENT`
> keyword. PostgreSQL is different.

In PostgreSQL, use the `SERIAL` keyword to auto-generate sequential
numeric IDs for records.

```sql
CREATE TABLE Company (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(20));
```

When you insert, **do not** specify the ID column. You **must** however,
give a column name list that includes the remaining column names you are
inserting data for. The ID column will be automatically generated by the
database.

```sql
INSERT INTO Company (Name) VALUES ('My Awesome Company');
```


## Joins

*This concept is* extremely important *to understanding how to use
relational databases!*

When you have two (or more) tables with data you wish to retrieve from
both, you do so by using a *join*. These come in a number of varieties,
some of which are covered here.

When you're using `SELECT` to make the join between two tables, you can
specify the tables specific columns are from by using the `.` operator.
This is especially useful when columns have the same name in the
different tables:

```sql
SELECT Animal.name, Farm.name
    FROM Animal, Farm
    WHERE Animal.FarmID = Farm.ID;
```

Tables to use in these examples:

```sql
CREATE TABLE Department (
    ID INT NOT NULL PRIMARY KEY,
    Name VARCHAR(20));

CREATE TABLE Employee (
    ID INT NOT NULL PRIMARY KEY,
    Name VARCHAR(20),
    DepartmentID INT);

INSERT INTO Department VALUES (10, 'Marketing');
INSERT INTO Department VALUES (11, 'Sales');
INSERT INTO Department VALUES (12, 'Entertainment');

INSERT INTO Employee VALUES (1, 'Alice', 10);
INSERT INTO Employee VALUES (2, 'Bob', 12);
INSERT INTO Employee VALUES (3, 'Charlie', 99);
```

**NOTE**: Importantly, department ID 11 is not referred to from
`Employee`, and department ID 99 (Charlie) does not exist in
`Department`. This is instrumental in the following examples.


### Inner Join, The Most Common Join

This is the most commonly-used join, by far, and is what people mean
when they just say "join" with no further qualifiers.

This will return only the rows that match the requirements from **both**
tables.

For example, we don't see "Sales" or "Charlie" in the join because
neither of them match up to the other table:

    dbname=> SELECT Employee.ID, Employee.Name, Department.Name
                 FROM Employee, Department
                 WHERE Employee.DepartmentID = Department.ID;
    
     id | name  |     name      
    ----+-------+---------------
      1 | Alice | Marketing
      2 | Bob   | Entertainment
    (2 rows)

Above, we used a `WHERE` clause to perform the inner join. This is
absolutely the most common way to do it.

There is an alternative syntax, below, that is barely ever used.

    dbname=> SELECT Employee.ID, Employee.Name, Department.Name
                 FROM Employee INNER JOIN Department
                 ON Employee.DepartmentID = Department.ID;

     id | name  |     name      
    ----+-------+---------------
      1 | Alice | Marketing
      2 | Bob   | Entertainment
    (2 rows)

### Left Outer Join

This join works like an inner join, but also returns *all* the rows from
the "left" table (the one after the `FROM` clause). It puts `NULL`
in for the missing values in the "right" table (the one after the
`LEFT JOIN` clause.)

Example:

    dbname=> SELECT Employee.ID, Employee.Name, Department.Name
                 FROM Employee LEFT JOIN Department
                 ON Employee.DepartmentID = Department.ID;

     id |  name   |     name      
    ----+---------+---------------
      1 | Alice   | Marketing
      2 | Bob     | Entertainment
      3 | Charlie | 
    (3 rows)

Notice that even though Charlie's department isn't found in `Department`, his record is still listed with a `NULL` department name.


### Right Outer Join

This join works like an inner join, but also returns *all* the rows from
the "right" table (the one after the `RIGHT JOIN` clause). It puts
`NULL` in for the missing values in the "right" table (the one after the
`FROM` clause.)

    dbname=> SELECT Employee.ID, Employee.Name, Department.Name
                 FROM Employee RIGHT JOIN Department
                 ON Employee.DepartmentID = Department.ID;

     id | name  |     name      
    ----+-------+---------------
      1 | Alice | Marketing
      2 | Bob   | Entertainment
        |       | Sales
    (3 rows)

Notice that even though there are no employees in the Sales department,
the Sales name is listed with a `NULL` employee name.

### Full Outer Join

This is a blend of a Left and Right Outer Join. All information from
both tables is selected, with `NULL` filling the gaps where necessary.

     dbname=> SELECT Employee.ID, Employee.Name, Department.Name
                  FROM Employee
                  FULL JOIN Department
                  ON Employee.DepartmentID = Department.ID;
                
     id |  name   |     name      
    ----+---------+---------------
      1 | Alice   | Marketing
      2 | Bob     | Entertainment
      3 | Charlie | 
        |         | Sales
    (4 rows)

* [Join at W3Schools](https://www.w3schools.com/sql/sql_join.asp)
* [Join at Wikipedia](https://en.wikipedia.org/wiki/Join_(SQL))


## Indexes

When searching through tables, you use a `WHERE` clause to narrow things
down. For speed, the columns mentioned in the `WHERE` clause should
either be a primary key, or a column for which an *index* has been
built.

Indexes help speed searches. In a large table, searching over an
unindexed column will be *slow*.

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

> `START TRANSACTION` is generally synonymous with `BEGIN` in SQL.

To execute the transaction ("Let's do it!"), end with a `COMMIT`
statement.

To abort the transaction and do nothing ("On second thought,
nevermind!") end with a `ROLLBACK` statement. *This makes it like
nothing within the transaction ever happened.*

Usually transactions happen within a program that checks for sanity and
either commits or rolls back.

Pseudocode making DB calls that check if a rollback is necessary:

```javascript
db("BEGIN"); // Begin transaction

db(`UPDATE accounts SET balance = balance - 100.00
    WHERE name = 'Alice'`);

let balance = db("SELECT balance WHERE name = 'Alice'");

// Don't let the balance go below zero:
if (balance < 0) {
    db("ROLLBACK"); // Never mind!! Roll it all back.
} else {
    db("COMMIT"); // Plenty of cash
}
```
    
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


## Quick and Dirty DB Design

Designing a non-trivial database is a difficult, learned skill best left to
professionals. Feel free to do small databases with minimal training, but if you
get in a professional situation with a large database that needs to be designed,
you should consult with people with strong domain knowledge.

That said, here are a couple pointers.

* In general, all your tables should have a unique `PRIMARY KEY` for each row.
  It's common to use `SERIAL` or `AUTO_INCREMENT` to make this happen.

* Keep an eye out for commonly duplicated data. If you are duplicating text data
  across several records, consider that maybe it should be in its own table and
  referred to with a foreign key.

* Watch out for unrelated data in the same record. If it's a record in the
  `Employee` table but it has `Department_Address` as a column, that probably
  belongs in a `Department` table, referred to by a public key.

But if you really want to design database, read on to the [Normalization and
Normal Forms](#normalization-and-normal-forms) section.


## Normalization and Normal Forms

*[This topic is very deep and this section cannot do it full justice.]*

*Normalization* is the process of designing or refactoring your tables
for maximum consistency and minimum redundancy.

With NoSQL databases, we're used to *denormalized* data that is stored
with speed in mind, and not so much consistency (sometimes NoSQL
databases talk about *eventual consistency*).

Non-normalized tables are considered an anti-pattern in relational databases.

There are many *normal forms*. We'll talk about First, Second, and Third
normal forms.


### Anomalies

One of the reasons for normalizing tables is to avoid *anomalies*.

*Insert anomaly*: When we cannot insert a row into the table because
some of the dependent information is not yet known. For example, we
cannot create a new class record in the school database, because the
record requires at least one student, and none have enrolled yet.

*Update anomaly*: When information is duplicated in the database *and*
some rows are updated but not others. For example, say a record contains
a city and a zipcode, but then the post office changes the zipcode. If
some of the records are updated but not others, some cities will have
the old zipcodes.

*Delete anomaly*: The opposite of an insert anomaly. When we delete some
information and other related information must also be deleted against
our will. For example, deleting the last student from a course causes
the other course information to be also deleted.

By normalizing your tables, you can avoid these anomalies.

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


Use a [*join*](#joins) to select all the animals in the farm:

```sql
SELECT Name, Farm.ID FROM Animal, Farm WHERE Farm.ID = Animal.FarmID;
```

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

Use a [*join*](#joins) to select all the animals in the farms:

```sql
SELECT Name, Farm.ID
    FROM Animal, FarmAnimal, Farm
    WHERE Farm.ID = FarmAnimal.FarmID AND
          Animal.ID = FarmAnimal.AnimalID;
```


### Third Normal Form (3NF)

A table in 3NF must already be in 2NF.

Additionally, columns that relate to each other AND to the key need to
be moved into their own tables. This is known as removing *transitive
dependencies*.

In the Farm example, the columns `Breed` and `ProducesEggs` are related.
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

Use a [*join*](#joins) to select all the animals names that produce eggs
in the farm:

```sql
SELECT Name, Farm.ID
    FROM Animal, FarmAnimal, BreedEggs, Farm
    WHERE Farm.ID = FarmAnimal.FarmID AND
          Animal.ID = FarmAnimal.AnimalID AND
          Animal.Breed = BreedEggs.Breed AND
          BreedEggs.ProducesEggs = TRUE;
```


### More reading:

* [Database Normalization Explained in Simple English](https://www.essentialsql.com/get-ready-to-learn-sql-database-normalization-explained-in-simple-english/)

* [Description of the database normalization basics](https://support.microsoft.com/en-us/help/283878/description-of-the-database-normalization-basics)

* [Database Normalization, Wikipedia](https://en.wikipedia.org/wiki/Database_normalization) (Dense)



## Node-Postgres

This is a library that allows you to interface with PostgreSQL through
NodeJS.

Its [documentation](https://node-postgres.com/) is exceptionally good.

* [Node-Postgres on GitHub](https://github.com/brianc/node-postgres)


### Assignments

* [NodeJS Program to Create and Populate a Table](#assignment-nodejs-program-to-create-and-populate-a-table)

* [Command-line Earthquake Query Tool](#assignment-command-line-earthquake-query-tool)

* [RESTful Earthquake Data Server](#assignment-restful-earthquake-data-server)


## Security

### PostgreSQL Password

You might have noticed that you don't need a password to access your
database that you created. This is because PostgreSQL by default uses
something called [peer authentication
mode](https://www.postgresql.org/docs/9.6/static/auth-methods.html#AUTH-PEER).

In a nutshell, it makes sure that you are logged in as yourself before
you access your database. If a different user tries to access your
database, they will be denied.

If you need to set up password access, see [client authentication in the
PostgreSQL
manual](https://www.postgresql.org/docs/current/static/client-authentication.html)

### Writing Client Software

When writing code that accesses databases, there are a few rules you
should follow to keep things safe.

* Don't store database passwords or other sensitive information in your
  code repository. Store dummy credentials instead.

* When building SQL queries in code, use [*parameterized
  queries*](https://node-postgres.com/features/queries#parameterized-query).
  You build your query with parameter placeholders for where the query
  arguments will go.
  
  This is your number-one line of defense against [SQL injection
  attacks](https://en.wikipedia.org/wiki/SQL_injection).

  **It's a seriously noob move to not use parameterized queries.**


## Other Relational Databases

There are tons of them by Microsoft, Oracle, etc. etc.

Other popular open source databases in widespread use are:

* [MySQL](https://www.mysql.com/) Multi-user, industrial class.
* [SQLite](https://www.sqlite.org/) Single-user, very fast, good for config files.


## Assignment: Install PostgreSQL

**IMPORTANT!** These instructions assume you haven't already installed
PostgreSQL. If you have already installed it, skip this section or
Google for how to upgrade your installation.

### Mac with Homebrew

1. Open a terminal
2. Install PostgreSQL: `brew install postgresql`

    If you get install errors at this point relating to the link phase
    failing or missing permissions, look back in the output and see
    what file it failed to write.

    For example, if it's failing to write something in
    `/usr/local/share/man`-something, try setting the ownership on
    those directories to yourself.

    Example (from the command line):

    `$ sudo chown -R $(whoami) /usr/local/share/man`

    Then try to install again.

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

### Windows

Reports are that one of the easiest installs is with
[chocolatey](https://chocolatey.org/packages/postgresql). Might want to try that
first.

You can also [download a Windows
installer](https://www.postgresql.org/download/windows/) from the
official site.

Another option is to use the [Windows Subsystem for
Linux](https://msdn.microsoft.com/en-us/commandline/wsl/install-win10)
and follow the [Ubuntu instructions for installing
PostgreSQL](https://help.ubuntu.com/community/PostgreSQL).


### Arch Linux

Arch requires a bit more hands-on, but not much more. Check this out if
you want to see a different Unix-y install procedure (or if you run
Arch).

* [Installing PostgreSQL on Arch
  Linux](https://wiki.archlinux.org/index.php/PostgreSQL)


## Assignment: Create a Table and Use It

Launch the shell on your database, and create a table.

```sql
CREATE TABLE Employee (ID INT, FirstName VARCHAR(20), LastName VARCHAR(20));
```

Insert some records:

```sql
INSERT INTO Employee VALUES (1, 'Alpha', 'Alphason');
INSERT INTO Employee VALUES (2, 'Bravo', 'Bravoson');
INSERT INTO Employee VALUES (3, 'Charlie', 'Charleson');
INSERT INTO Employee VALUES (4, 'Delta', 'Deltason');
INSERT INTO Employee VALUES (5, 'Echo', 'Ecoson');
```

Select all records:

```sql
SELECT * FROM Employee;
```

Select Employee #3's record:

```sql
SELECT * FROM Employee WHERE ID=3;
```

Delete Employee #3's record:

```sql
DELETE FROM Employee WHERE ID=3;
```
 
Use `SELECT` to verify the record is deleted.

Update Employee #2's name to be "Foxtrot Foxtrotson":

```sql
UPDATE Employee SET FirstName='Foxtrot', LastName='Foxtrotson' WHERE ID=2;
```

Use `SELECT` to verify the update.


## Assignment: NodeJS Program to Create and Populate a Table

Using [Node-Postgres](https://node-postgres.com/), write a program that
creates a table.

Run the following query from your JS code:

```sql
CREATE TABLE IF NOT EXISTS Earthquake
    (Name VARCHAR(20), Magnitude REAL)
```

Populate the table with the following data:

```javascript
let data = [
    ["Earthquake 1", 2.2],
    ["Earthquake 2", 7.0],
    ["Earthquake 3", 1.8],
    ["Earthquake 4", 5.2],
    ["Earthquake 5", 2.9],
    ["Earthquake 6", 0.6],
    ["Earthquake 7", 6.6]
];
```

You'll have to run an `INSERT` statement for each one.

Open a PostgreSQL shell (`psql`) and verify the table exists:

    user-> \dt
              List of relations
     Schema |    Name    | Type  | Owner 
    --------+------------+-------+-------
     public | earthquake | table | user
    (1 row)

Also verify it is populated:

    user-> SELECT * from Earthquake;
    
         name     | magnitude 
    --------------+-----------
     Earthquake 1 |       2.2
     Earthquake 2 |         7
     Earthquake 3 |       1.8
     Earthquake 4 |       5.2
     Earthquake 5 |       2.9
     Earthquake 6 |       0.6
     Earthquake 7 |       6.6
    (7 rows)

Hints:
* [CREATE TABLE](#create-a-table-with-create-table)
* [Connecting to the database](https://node-postgres.com/features/connecting)
* [Running a query](https://node-postgres.com/features/queries)

Extra Credit:
* Add an ID column to help normalize the database. Make this column
  `SERIAL` to auto-increment.
* Add Date, Lat, and Lon columns to record more information about the
  event.


## Assignment: Command-line Earthquake Query Tool

Write a tool that queries the database for earthquakes that are at least
a given magnitude.

    $ node earthquake 2.9
    Earthquakes with magnitudes greater than or equal to 2.9:
    
    Earthquake 2: 7
    Earthquake 7: 6.6
    Earthquake 4: 5.2
    Earthquake 5: 2.9

Use `ORDER BY Magnitude DESC` to order the results in descending order
by magnitude.


## Assignment: RESTful Earthquake Data Server

Use [ExpressJS](https://expressjs.com/) and write a webserver that
implements a RESTful API to access the earthquake data.

Endpoints:

`/` (GET) Output usage information in HTML.

Example results:

```html
<html>
    <body>Usage: [endpoint info]</body>
</html>
```

`/minmag` (GET) Output JSON list of earthquakes that are larger than the
value specified in the `mag` parameter. Use form encoding to pass the
data.

Example results:

```json
{
    "results": [
        {
            "name": "Earthquake 2",
            "magnitude": 7
        },
        {
            "name": "Earthquake 4",
            "magnitude": 5.2
        }
    ]
}
```

Extra Credit:

`/new` (POST) Add a new earthquake to the database. Use form encoding to
pass `name` and `mag`. Return a JSON status message:

```json
{ "status": "ok" }
```

or

```json
{ "status": "error", "message": "[error message]" }
```


`/delete` (DELETE) Delete an earthquake from the database. Use form
encoding to pass `name`. Return status similar to `/new`, above.


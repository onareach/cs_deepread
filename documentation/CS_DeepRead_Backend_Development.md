# CS DeepRead Backend Development

The overall plan for developing the backend components of CS DeepRead is to build them locally and then replicate them to Heroku when they are stable

The back-end components include:

1. PostgreSQL database for storing and retrieving book text

2. OpenAI text parser

   

### Review of Functionality

**1.  User uploads image** via drag-and-drop

**2.  Image is saved** to `/public/uploads` 

**3.  Backend API route reads the image and sends it to OpenAI**

**4.  OpenAI returns structured JSON** (lines, line numbers, paragraph flags, etc.)

**5.  Your backend inserts parsed data into PostgreSQL**

Note: Front-end development for Steps 1 and 2 is complete.



### PostgreSQL Database Setup

The first step is verifying that PostgreSQL is installed on the local computer. In terminal, run:

```
psql --version
```

The response:

```
psql (PostgreSQL) 14.17 (Homebrew)
```

This response shows that PostgreSQL is installed locally.



#### Step 1 – Verify or Setup Database Security

Login with the default (laptop) superuser account with the following command:

```
$ psql -U postgres
```

You will be prompted for a password:

```
Password for user postgres: 
```

The `postgres` password is the same as the password you normally use to log on to your local machine. After entering this password, you will see the following:

```
WARNING: psql major version 14, server major version 16.
         Some psql features might not work.
Type "help" for help.

postgres=#
```

(Later, to exit postgres, used the `\q` command.)

If you want to create another account, use the following command, replacing `new_user` and  `yourpassword` with a real username and password of your choice:

```
CREATE USER 'new_user' WITH PASSWORD 'yourpassword';
```



#### Step 2 – Create Database

Create a database with the following command:

```
postgres=# CREATE DATABASE deepread_db;
```

The response should be:

```
CREATE DATABASE
postgres=#
```

If you need to see if the database has already been created, use the `\l` command. For example:

```
postgres=# \l
                                  List of databases
        Name         |  Owner   | Encoding | Collate | Ctype |   Access privileges   
---------------------+----------+----------+---------+-------+-----------------------
 InformationQuality  | postgres | UTF8     | C       | C     | 
 deepread_db         | postgres | UTF8     | C       | C     | 
 postgres            | postgres | UTF8     | C       | C     | 
 quality_information | postgres | UTF8     | C       | C     | 
 template0           | postgres | UTF8     | C       | C     | =c/postgres          +
                     |          |          |         |       | postgres=CTc/postgres
 template1           | postgres | UTF8     | C       | C     | =c/postgres          +
                     |          |          |         |       | postgres=CTc/postgres
 test                | postgres | UTF8     | C       | C     | 
(7 rows)

postgres=#
```



#### Step 3 – Create Tables

Create the `books` and  `book_text` tables:

```
postgres=# -- Create books table
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL
);

-- Create book_text table
CREATE TABLE book_text (
  id SERIAL PRIMARY KEY,
  book_id INTEGER REFERENCES books(id),
  page_number TEXT NOT NULL,
  line_number INTEGER NOT NULL,
  sequence_id INTEGER NOT NULL,
  text TEXT NOT NULL,
  text_type TEXT NOT NULL CHECK (text_type IN ('normal', 'heading', 'title', 'quote', 'marginal_heading')),
  marginal_heading TEXT,
  paragraph_start BOOLEAN DEFAULT FALSE
);
```

The response should be:

```
CREATE TABLE
CREATE TABLE
postgres=#
```



#### Step 4 – Insert Some Test Data

Run the following SQL to insert some test book data:

```
-- Insert a book
INSERT INTO books (title) VALUES ('Science and Health') RETURNING id;
```

Response:

```
 id 
----
  1
(1 row)

INSERT 0 1
```

Run the following SQL to insert some test book text data:

```
-- Insert a few lines of book text
INSERT INTO book_text (book_id, page_number, line_number, sequence_id, text, text_type, marginal_heading, paragraph_start)
VALUES
  (1, 'vii', 0, 1, 'Preface', 'title', NULL, TRUE),
  (1, 'vii', 1, 2, 'To those leaning on the sustaining infinite, today is big with blessings.', 'normal', NULL, TRUE),
  (1, 'vii', 2, 3, 'The wakeful shepherd beholds the first faint morning beams...', 'normal', NULL, FALSE);
```

Response:

```
INSERT 0 3
```



#### Step 5 – Review the Schema and Sample Data

Still in the `postgres=#` prompt, you can check the schema with the `\d` command:

```
postgres=# \d
                List of relations
 Schema |       Name       |   Type   |  Owner   
--------+------------------+----------+----------
 public | book_text        | table    | postgres
 public | book_text_id_seq | sequence | postgres
 public | books            | table    | postgres
 public | books_id_seq     | sequence | postgres
(4 rows)
```

To view a specific table, add the table name to the `\d` command:

```
postgres=# \d book_text;
                                 Table "public.book_text"
      Column      |  Type   | Collation | Nullable |                Default                
------------------+---------+-----------+----------+---------------------------------------
 id               | integer |           | not null | nextval('book_text_id_seq'::regclass)
 book_id          | integer |           |          | 
 page_number      | text    |           | not null | 
 line_number      | integer |           | not null | 
 sequence_id      | integer |           | not null | 
 text             | text    |           | not null | 
 text_type        | text    |           | not null | 
 marginal_heading | text    |           |          | 
 paragraph_start  | boolean |           |          | false
Indexes:
    "book_text_pkey" PRIMARY KEY, btree (id)
Check constraints:
    "book_text_text_type_check" CHECK (text_type = ANY (ARRAY['normal'::text, 'heading'::text, 'title'::text, 'quote'::text, 'marginal_heading'::text]))
Foreign-key constraints:
    "book_text_book_id_fkey" FOREIGN KEY (book_id) REFERENCES books(id)
```

Note: The first line in the *Indexes* section above indicates the the primary key of the table if the *id* column. The *Check constraints* section shows that the *text_type* column will only accept values of "normal", "heading", "title", "quote", and "marginal heading".

Run SELECT queries to review the test data:

```
postgres=# SELECT * FROM book_text;
 id | book_id | page_number | line_number | sequence_id |                                   text                                    | text_type | marginal_heading | paragraph_start 
----+---------+-------------+-------------+-------------+---------------------------------------------------------------------------+-----------+------------------+-----------------
  1 |       1 | vii         |           0 |           1 | Preface                                                                   | title     |                  | t
  2 |       1 | vii         |           1 |           2 | To those leaning on the sustaining infinite, today is big with blessings. | normal    |                  | t
  3 |       1 | vii         |           2 |           3 | The wakeful shepherd beholds the first faint morning beams...             | normal    |                  | f
(3 rows)

postgres=# SELECT * FROM books;
 id |       title        
----+--------------------
  1 | Science and Health
(1 row)
```



### Backend API to Parse and Store Text

Step 1: Add the following file:

```
src/app/api/parse/route.ts
```

Step 2: Add the following to the `.env.local` file:

```
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://deepread_user:yourpassword@localhost:5432/deepread_db
```

Step 3: Install the OpenAI and PostgreSQL client packages. When in cs_projects/CS_DeepRead/frontend folder, run the following installation commands:

```
npm install openai
npm install pg
npm install --save-dev tsx
```

Verify the install by running the following command:

```
cat package.json
```

The output should include:

```
{
  ...
  "dependencies": {
    "openai": "^4.91.1",
    "pg": "^8.14.1"
  }
}
```


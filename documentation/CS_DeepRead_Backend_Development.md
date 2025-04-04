# CS DeepRead Backend Development

The overall plan for developing the backend components of CS DeepRead is to build them locally and then replicate them to Heroku when they are stable.

The first step is verifying that PostgreSQL is installed on the local computer. In terminal, run:

```
psql --version
```

The response:

```
psql (PostgreSQL) 14.17 (Homebrew)
```

Good to go!



#### Step 1 – Verify or Setup Database Security

I was unable to login to my local PostgreSQL database with the username and password that I would normally use, so I logged in as the PostgreSQL superuser:

```
$ psql -U postgres

Password for user postgres: 
psql (14.17 (Homebrew), server 16.2)
WARNING: psql major version 14, server major version 16.
         Some psql features might not work.
Type "help" for help.

postgres=#
```

Using the superuser account, create a new user:

Replace `deepread_user` and  `yourpassword` with a real username and password of your choice:

```
CREATE USER 'deepread_user' WITH PASSWORD 'yourpassword';
```



#### Step 2 – Create Database with New User as Owner
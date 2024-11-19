Instructions to run this app locally.

[I] DB Setup - 
  1. Install mongo DB on your machine(ignore is already installed).
  2. Start mongo db server using command - 'mongod'
  3. Create a database named - 'todo'
    > use todo // 'use' command will create the db if it doesn't exists.
  4. Create a user with some strong password on it.
    > db.createUser(
        {
          user: "xxxxxxxxx",
          pwd: "xxxxxxxxx",
          roles: [ { role: "readWrite", db: "todo" }]
        }
      )

[II] How to install/run the app?
  1. clone this repo and run 
     'npm i'
  2. Create an ".env" file with the following parameters with your secrets.
      PORT=XXXX
      ENV=(server env - PROD OR DEV)
      JWT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
      DB_URL=mongodb://<db_user>:<db_password>@<url>:<port>/todo
  3. To start the app, run
     'npm run start'

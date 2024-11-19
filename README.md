#Instructions to run this app locally.#

[I] DB Setup - 
  1. Install mongo DB on your machine(ignore if already installed).
  2. Start the mongo db server.
  3. Create a database named - 'todo'
    > use todo // will create the db if it doesn't exists.
  4. Create a user with a strong password on it.
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
      PORT=XXXX #Replace XXXX with the port that you want your server to listen to.
      ENV=(server environment - PROD OR DEV)
      JWT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
      DB_URL=mongodb://<db_user>:<db_password>@<url>:<port>/todo
      #Replace <db_user> and <db_password> with the user and the password that was created in Step 4 of DB Setup. If you already have created a user, then you can use that too.

      Note on ENV - 
      By setting ENV=DEV, we will get stack-trace in the response when an error occurs. This could be useful for debugging purpose.
      For Prod environment, ENV=PROD should be used.

  3. To start the app, run
     'npm run start'

#API Reference#
  1. User
     1.1 SignUp/Create user - 
      Method - POST Req. URL - `localhost:<PORT>/api/user/signup`
     1.2 Login -
      Method - POST Req. URL - `localhost:<PORT>/api/user/login`
      Request body for both the above APIs is as follows:
      `
      {
          "email": "test@test.com",
          "password": "xxxxxxx"
      }
      `
      Validations - 
        'email' should be a valid email ID.
        'password' should be a alphanumeric string of minimum 6 and max 20 characters long.
      
      After Login is successful, we get a Token in the response as shown below.
      `{
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3M2NkMzY5MmFhNWJiNGZmY2RhZTczMyIsImlhdCI6MTczMjA0MTUxOSwiZXhwIjoxNzMyMzAwNzE5fQ.fKntxJpjHbVCO-isiv18zoDXltaEtfbKGxmrnUtwFPQ"
      }`
      IMP - This token should be provided in every subsequent requests'(all mentioned below) header as-
      `Authorization: "eyJhbGciOi...."`
    
  2. Todo
    2.1 Add a todo item - 
      Method - POST Req. URL - `localhost:<PORT>/api/user/todo/add`
      Request body for both the above APIs is as follows:
      `
      {
          "title": "some title",
          "description": "some description",
          "dueDate": "MM/DD/YYYY",
          "completed": false
      }
      `
      Validations - 
        title - can have spaces and alphanumeric characters
        description - can have spaces, period('.'), commas(',') and alphanumeric characters
        dueDate - Should be in "MM/DD/YYYY" format. i.e. "01/12/2024"
        completed - is optional and will be by default set to false.
    
    2.2 Get all Todo items
      Method - GET Req. URL - `localhost:<PORT>/api/user/todo/all`
      Results(sample)
      `{
        "success": true,
        "msg": "Todo items fetched successfully!",
        "data": [
          {
            "_id": "673ce3233fdf8fe13fccd66f",
            "title": "abc2",
            "description": "some meaningFull info2",
            "dueDate": "11/19/2024",
            "completed": true
          },
          {
            "_id": "673ce3313fdf8fe13fccd673",
            "title": "abc3",
            "description": "some meaningFull info3",
            "dueDate": "11/18/2024",
            "completed": true
          }
        ]
      }`
      Here the '_id' values are unique and could be used to fetch todo items individually.

    2.3 Get single Todo item by 'id'
      Method - GET Req. URL - `localhost:<PORT>/api/user/todo/id/<id>`
      e.g. `localhost:<PORT>/api/user/todo/id/673ce3313fdf8fe13fccd673`
    
    2.4 Delete a Todo item by 'id'
      Method - DELETE Req. URL - `localhost:<PORT>/api/user/todo/id/<id>`
      e.g. `localhost:<PORT>/api/user/todo/id/673ce3233fdf8fe13fccd66f`

    2.5 Update a Todo item by 'id'
      Method - PUT Req. URL - `localhost:<PORT>/api/user/todo/id/<id>`
      e.g. `localhost:<PORT>/api/user/todo/id/673ce3313fdf8fe13fccd673`
      Request body is as follows:
      `
      {
          "title": "some title",
          "description": "some description",
          "dueDate": "MM/DD/YYYY",
          "completed": false
      }
      `
      All these fields have same validations as there are while adding/creating a todo item.
      All fields are kept optional. That means, we can provide only those fields which we want to update. 
      For example if we only want to update 'dueDate' and 'title' we can create the request body as -
      `
      {
          "title": "some updated title",
          "dueDate": "MM/DD/YYYY"
      }
      `
      Expected Response - The API will return only the updated properties. To view the all the properties of a todo item, please follow point# 2.3 mentioned above.

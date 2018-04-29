# TunariServer
Tunari server

To set up database you need to:

- Pull a user from production instance that you know its password and add it to users collection
- Pull proper settings from production instance and add them to settings collection

To set up TunariServer you need to run:

- If you do not have nodejs installed, intalled by looking oficial releases.
- npm install
- Copy your local.env.sample.js to create an local.env.js and 
  modify with your configs.  
- If you do not have gulp installed globally installed by running: npm install --global gulp-cli  
- Run: gulp
- As soon as you have the tokens collections in your database, create an index for token expiration:
    db.tokens.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 86400 } )

# To deploy TunariServer

Repository on git is configured to deploy to heroku every merge to master.

# About Authorization

- Authoraized requests need a header like {key: authorization, value: Bearer <Jwt>}
- To Login send a request to /api/login with userName and password in the body 
  and a header: {"Content-Type":"application/json"}
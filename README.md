# TunariServer
Tunari server

To set up TunariServer you need to run:

- npm install
- Copy your local.env.sample.js to create an local.env.js and 
  modify with your configs.
- gulp

# To deploy TunariServer

Repository on git is configured to deploy to heroku every merge to master.

# About Authorization

- Authoraized requests need a header like {key: authorization, value: Bearer <Jwt>}
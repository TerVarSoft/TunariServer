// Use this file as a template to create your own local.env.js file.
// Use local.env.js for environmet variables related to
// your local machine settings, like your url or your secrets.

// This file local.env.js should not be tracked by git.

process.env['NODE_ENV'] = "development"
process.env['TUNARI_DB'] = "mongodb://localhost/tunariDB-dev"
process.env['logDir'] = "./log";
process.env['BONSAI_URL'] = "http://localhost:9200";
process.env['TUNARI_SECRET'] = "tunariSecret";
process.env['PORT'] = 8000;
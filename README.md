# Full-Stack Engineering Exercise

You're tasked with building a small, end-to-end data processing system for a fictional telecom company. The system should accept CDR (Call Detail Record) files containing raw usage strings, parse them into a normalized format, store them in a database, and make the usage data queryable via API and UI.

## Download & build repo
* Make a new directory
* `git clone https://github.com/schroederLS7/cdr-app.git`
* `npm install` from both server and client subdirs
* `npm run build` from client subdir
* `npm run build` from server subdir

## NPM script targets - Client code
Run from inside `client` subdir
* `dev` - run client development server
* `build` - build client for distribution
* `lint` - run linter
* `preview` - serve the compiled client from dist

## NPM script targets - Server code
Run from inside `server` subdir
* `test` - run unit tests
* `test-debug` - run unit tests with debugger support
* `build` - build server backend
* `start` - run production server
* `dev` - run dev server (with nodemon)
* `debug` - run dev server (with nodemon) and debugging support

### Note: For running in dev mode
* create an `uploads` directory in the root of the server application to give a location for local file storage when uploading files

## Run full stack application - using Docker containers
From root-dir of cloned repo: 
`docker-compose -f docker-compose.yaml up --build`

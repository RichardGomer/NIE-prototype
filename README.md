# NIE Prototype

## Vite App Instructions
The app is created using Vite + React. The dev build can be run with the following command, allowing you to connect to the client using localhost in the browser.
```bash
npm run dev
```
## API Server Instructions
The API server is built using Express and TypeScript. It provides simple access to data stored in MongoDB. 

It can be started with the following command
```bash
npm run api
```
This will start the server on port 3000, and it will be ready to accept RPC calls from the client.

A .env file must be created, containing a `MONGO_URI` variable with the connection string for your MongoDB instance. For example:
```
MONGO_URI=mongodb://username:password@localhost:27017/nie-db
```

## Start both
To start both the client and the API server concurrently, you can use the following command from the react-client directory:
```bash
npm run dev:all
```


## Implementation Notes
Fragments in the canvas are currently created by rendering HTML in an svg format. They currently do not scale properly within the fragment bounds, or implement any css styling within the html.

More info on how this can be changed: https://ronvalstar.nl/render-html-to-an-image

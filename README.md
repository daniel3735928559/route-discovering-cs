## Discovering CS routing server

This simple server reads a JSON manifest file and routes all requests accordingly.

To run it, edit manifest.json to include all the desired routes (with
the full hostname and port specified) and then do:

```
npm install
node app.js [port number] path/to/manifest.json
```
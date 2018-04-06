# Video Capturing Example
This was to prototype a featuer to capture survey results from Deaf participants 
who wished to submit responses in ASL.

### System Dependencies
- node 9.11.1
- npm 5.8.0
- browserify 16.1.1

### Installation for Mac
- I assume you already have [brew](https://brew.sh) installed
- Get `node` and `browserify` installed
For a fresh installation:
```
brew install node
```

If you already have node / npm but they're too old:
```
brew upgrade node
```

You can upgrade npm as well after upgrading node with:
```
npm upgrade -g npm
```

Once that's set make sure you have browserify to handle all of the imports:
```
npm install -g browerify
```

### Running the app
Compile the build script file:
```
npm run-script build
```

Then turn on the server:
```
node server.js
```

The application will run on localhost:8000


# Video Capturing Example
This was to prototype a feature to capture survey results from Deaf participants 
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
npm install -g browserify
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

The application will run on http://localhost:8000

### File Conversion
This downloads files as .webm. I use [ffmpeg](https://www.ffmpeg.org/documentation.html) to convert these into H264 mp4 files.
You can install it with brew:
```
brew install ffmpeg --with-libvpx --with-libvorbis
```

And to convert the .webm files to .mp4 using the H264 codec:
```
ffmpeg -i original.webm -vcodec libx264 -acodec aac converted.mp4
```

You can use other codecs. If you're not sure which are supported run you can print them all out.
I find that it's easier to dump them into a file and then peruse with your favorite editor:
```
ffmpeg -codecs > some_file_to_peruse.txt
```

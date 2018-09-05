# Video Capturing Example
This was to prototype a feature to capture survey results from Deaf participants 
who wished to submit responses in ASL.

### System Dependencies
- node 9.11.1
- npm 5.8.0
- browserify 16.1.1

### Installation for Mac

```
npm install
```

### Running the app

```
npm start
```

If you make file changes you will have to rebuild and serve.

The application will run on http://localhost:8888

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

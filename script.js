var RecordRTC = require('recordrtc');
var FileSaver = require('file-saver');
var $ = require("jquery");

$(document).ready(function() {
  var recorder = null;
  var stream = null;

  var $activateButton = $('#activate');
  var $deactivateButton = $('#deactivate');

  var $startButton = $('#start');
  var $pauseButton = $('#pause');
  var $resumeButton = $('#resume');
  var $stopButton = $('#stop');

  function updateStatus() {
    var $cameraStatus = $('#camera-status');
    var $recorderStatus = $('#recorder-status');

    var isCameraActive = !!stream;
    $cameraStatus.html("Camera is " + (isCameraActive ? 'active' : 'inactive') + '.');
    $cameraStatus.css("color", isCameraActive ? 'green' : 'black');

    var state = recorder ? recorder.state : 'inactive';
    var color = (function() {
      switch(state) {
        case 'recording':
          return 'green';
        case 'paused':
          return 'orange';
        case 'stopped':
          return 'red';
        default:
          return 'black';
      }
    })();


    $recorderStatus.html('Recorder is ' + state + '.');
    $recorderStatus.css('color', color);
  }

  function updatePreview(mediaStream) {
    var video = $('#preview')[0];
    video.srcObject = mediaStream;
    video.onloadedmetadata = function(e) {
      video.play();
    };
  }

  function enableCameraButtons() {
    $activateButton.prop('disabled', true);
    $deactivateButton.prop('disabled', false);

    $startButton.prop('disabled', false);
    $pauseButton.prop('disabled', false);
    $resumeButton.prop('disabled', false);
    $stopButton.prop('disabled', false);
  }

  function disabledCameraButtons() {
    $activateButton.prop('disabled', false);
    $deactivateButton.prop('disabled', true);

    $startButton.prop('disabled', true);
    $pauseButton.prop('disabled', true);
    $resumeButton.prop('disabled', true);
    $stopButton.prop('disabled', true);
  }

  function enableCamera() {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(mediaStream){
      // Initialize stream and recorder objects
      stream = mediaStream;

      recorder = RecordRTC(stream, {
        type: 'video',
        mimeType: 'video/mp4;codecs=h264'
      });

      // Enable buttons
      enableCameraButtons();

      // Bind event handlers
      recorder.onStateChanged = function(state) {
        updateStatus();
      };

      $startButton.on('click', function() {
        recorder.startRecording(function(){ 
          updateStatus();
          updatePreview();
        });
      })

      $stopButton.on('click', function() {
        recorder.stopRecording(function() {
          updateStatus();
          var raw = this.getBlob();
          var blob = new Blob([raw], { type: 'video/webm' });
          var filename = (
            '_recorded_HTML_video_' +
            (new Date()).toJSON().replace(/:/g,'-') +
            '.webm'
          );

          FileSaver.saveAs(blob, filename);
        });
      })

      $pauseButton.on('click', function() {
        recorder.pauseRecording(function(){ updateStatus() });
      })
      $resumeButton.on('click', function() {
        recorder.resumeRecording(function(){ updateStatus() });
      })

      updateStatus();

    }).catch(function(error) {
      console.log("Getting User Media stream failed.", error);
    })
  }

  function disableCamera() {
    disabledCameraButtons();

    stream.getTracks().forEach(function(track) {
      track.stop();
    });

    stream = null;
    recorder = null;

    updateStatus();
  }

  $activateButton.on('click', enableCamera);
  $deactivateButton.on('click', disableCamera);
})
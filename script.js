'use strict';

(function(){
  /*
  * Import Dependencies
  */
  var RecordRTC = require('recordrtc');
  var FileSaver = require('file-saver');
  var $ = require("jquery");

  /*
  * Instantiate Camera and State Elements
  */
  var recorder = null;
  var stream = null;
  var video = $('video#preview')[0];

  var $activateButton = $('#activate');
  var $deactivateButton = $('#deactivate');

  var $startButton = $('#start');
  var $pauseButton = $('#pause');
  var $resumeButton = $('#resume');
  var $stopButton = $('#stop');

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

    $startButton.prop('disabled', true).off('click');
    $pauseButton.prop('disabled', true).off('click');
    $resumeButton.prop('disabled', true).off('click');
    $stopButton.prop('disabled', true).off('click');
  }

  function getColorFromState(state) {
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
  }

  function updateStatus() {
    var $cameraStatus = $('#camera-status');
    var $recorderStatus = $('#recorder-status');

    var isCameraActive = !!stream;
    $cameraStatus.html("Camera is " + (isCameraActive ? 'active' : 'inactive') + '.');
    $cameraStatus.css("color", isCameraActive ? 'green' : 'black');

    var state = recorder ? recorder.state : 'inactive';
    var color = getColorFromState(state);

    $recorderStatus.html('Recorder is ' + state + '.');
    $recorderStatus.css('color', color);
  }

  function updatePreview(blob) {
    if (blob) {
      hideLivePreview()
      video.src = URL.createObjectURL(blob);
      video.play();
    }
  }

  function turnOffDevices() {
    stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }

  function disableCamera() {
    disabledCameraButtons();
    turnOffDevices();

    stream = null;
    recorder = null;

    updateStatus();
  }

  function showLivePreview() {
    video.controls = false;
    video.srcObject = stream;
  }

  function hideLivePreview() {
    video.controls = true;
    video.srcObject = null;
  }

  function setupCapture() {
    

    function enableCamera() {
      navigator.mediaDevices.getUserMedia({ video: true }).then(function(mediaStream){
        // Initialize stream and recorder objects
        stream   = mediaStream;
        recorder = RecordRTC(stream, {
          type: 'video',
          mimeType: 'video/webm',
          disableLogs: true
        });

        showLivePreview();

        // Enable buttons
        enableCameraButtons();

        // Bind event handlers
        recorder.onStateChanged = function(state) {
          updateStatus();
        };

        $startButton.on('click', function() { 
          recorder.clearRecordedData();
          showLivePreview();
          recorder.startRecording();
        });
        
        $pauseButton.on('click', function() { recorder.pauseRecording() });
        
        $resumeButton.on('click', function() { recorder.resumeRecording() });

        $stopButton.on('click', function() {
          recorder.stopRecording(function() {
            var raw = this.getBlob();
            var blob = new Blob([raw], { type: 'video/webm' });
            var filename = (
              '_recorded_HTML_video_' +
              (new Date()).toJSON().replace(/:/g,'-') +
              '.webm'
            );
            updatePreview(raw);
            FileSaver.saveAs(blob, filename);
          });
        })

        // Update HTML Labels
        updateStatus();

      }).catch(function(error) {
        console.debug("Getting User Media stream failed. Perhaps user declined permission.", error);
      })
    }

    $activateButton.on('click', enableCamera);
    $deactivateButton.on('click', disableCamera);
  }

  $(document).ready(setupCapture)
}());
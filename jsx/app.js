import React from 'react';
import ReactDOM from 'react-dom';
import Copy from './copy.js';
import {getID, replaceEvent} from './utils.js';

class Init extends React.Component {
  constructor() {
    super();
    this.state = {
      myDropzone: null,
      recordRTC: null,
      stream: null
    };

    this.cameraRequest = this.cameraRequest.bind(this);
    this.stopCamera = this.stopCamera.bind(this);
    this.createDropzone = this.createDropzone.bind(this);

    this.onWebcamButton = this.onWebcamButton.bind(this);
    this.onPhotoButton = this.onPhotoButton.bind(this);
    this.onVideoButton = this.onVideoButton.bind(this);

    this.offWebcamButton = this.offWebcamButton.bind(this);
    this.offPhotoButton = this.offPhotoButton.bind(this);
    this.offVideoButton = this.offVideoButton.bind(this);

    this.takePhoto = this.takePhoto.bind(this);
    this.takePhotoHotkey = this.takePhotoHotkey.bind(this);

    this.startRecord = this.startRecord.bind(this);
    this.startRecordHotkey = this.startRecordHotkey.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.stopRecordHotkey = this.stopRecordHotkey.bind(this);
    this.resetVideoButton = this.resetVideoButton.bind(this);
  }

  cameraRequest() {
    var camera = getID('camera');
    var constraints = {
      video: true,
      audio: true
    };
    var errBack = function(err) {
      console.log(err);
    };

    if(navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        this.setState({stream: stream});
        camera.srcObject = this.state.stream;
        camera.onloadedmetadata = function(e) {
          camera.play();
        }

        this.onWebcamButton();
      }).catch(errBack);
    } else if(navigator.webkitGetUserMedia) {
      // old Chrome
      navigator.webkitGetUserMedia(constraints, (stream) => {
        this.setState({stream: stream});
        camera.src = URL.createObjectURL(this.state.stream);
        camera.play();

        this.onWebcamButton();
      }, errBack);
    } else if(navigator.mozGetUserMedia) {
      // old firefox
      navigator.mozGetUserMedia(constraints, (stream) => {
        this.setState({stream: stream});
        camera.src = URL.createObjectURL(this.state.stream);
        camera.play();

        this.onWebcamButton();
      }, errBack);
    }
  }

  stopCamera() {
    var video = this.state.stream.getVideoTracks()[0];
    video.stop();

    var audio = this.state.stream.getAudioTracks()[0];
    audio.stop();

    this.setState({stream: null});
    this.offWebcamButton();
  }

  offWebcamButton() {
    var toggleCam = getID('toggle-cam');
    toggleCam.textContent = 'Turn on webcam';
    toggleCam.classList.remove('btn-danger');
    toggleCam.classList.add('btn-info');
    replaceEvent(toggleCam, 'click', this.cameraRequest, this.stopCamera);

    this.offPhotoButton();
    this.resetVideoButton();
  }

  offPhotoButton() {
    var takePhoto = getID('take-photo');
    takePhoto.disabled = true;
    takePhoto.removeEventListener('click', this.takePhoto);
    document.removeEventListener('keyup', this.takePhotoHotkey);
  }

  onWebcamButton() {
    var toggleCam = getID('toggle-cam');
    toggleCam.textContent = 'Turn off webcam';
    toggleCam.classList.remove('btn-info');
    toggleCam.classList.add('btn-danger');
    replaceEvent(toggleCam, 'click', this.stopCamera, this.cameraRequest);

    this.onPhotoButton();
    this.onVideoButton();
  }

  onPhotoButton() {
    var takePhoto = getID('take-photo');
    takePhoto.disabled = false;
    takePhoto.addEventListener('click', this.takePhoto);
    document.addEventListener('keyup', this.takePhotoHotkey);
  }

  onVideoButton() {
    var recordVideo = getID('record-video');
    recordVideo.textContent = 'Start record';
    recordVideo.classList.remove('btn-warning');
    recordVideo.classList.add('btn-success');
    recordVideo.disabled = false;

    replaceEvent(recordVideo, 'click', this.startRecord, this.stopRecord);
    replaceEvent(document, 'keyup', this.startRecordHotkey, this.stopRecordHotkey);
  }

  offVideoButton() {
    var recordVideo = getID('record-video');
    recordVideo.textContent = 'Stop record';
    recordVideo.classList.remove('btn-success');
    recordVideo.classList.add('btn-warning');

    replaceEvent(recordVideo, 'click', this.stopRecord, this.startRecord);
    replaceEvent(document, 'keyup', this.stopRecordHotkey, this.startRecordHotkey);
  }

  resetVideoButton() {
    if(this.state.recordRTC) {
      this.stopRecord();
    }

    var recordVideo = getID('record-video');
    recordVideo.disabled = true;
    recordVideo.removeEventListener('click', this.startRecord);
    recordVideo.removeEventListener('click', this.stopRecord);
    document.removeEventListener('keyup', this.startRecordHotkey);
    document.removeEventListener('keyup', this.stopRecordHotkey);
  }

  takePhoto() {
    var w = 1440;
    var h = 1080;
    var video = getID('camera');

    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h); // draw full canvas

    var dataURL = canvas.toDataURL('image/png');
    var a = dataURL.split(',')[1];
    var data = atob(a);
    var array = [];
    for(var k = 0; k < data.length; k++) {
      array.push(data.charCodeAt(k));
    }

    var file = new File([new Uint8Array(array)], 'picture.png', {type: 'image/png'});
    this.state.myDropzone.addFile(file);
  }

  takePhotoHotkey(e) {
    if(e.keyCode == 84) {
      this.takePhoto();
    }
  }

  startRecord() {
    var options = {
      disableLogs: true,
      type: 'video',
      video: {
        width: 1920,
        height: 1080
      },
      canvas: {
        width: 1920,
        height: 1080
      },
      frameInterval: 20,
      mimeType: 'video/mp4',
      bitsPerSecond: 6000000
    };
    this.setState({recordRTC: RecordRTC(this.state.stream, options)});
    this.state.recordRTC.startRecording();

    this.offVideoButton();
  }

  startRecordHotkey(e) {
    if(e.keyCode == 83) {
      this.startRecord();
    }
  }

  stopRecord() {
    this.state.recordRTC.stopRecording((videoURL) => {
      var blob = this.state.recordRTC.getBlob();
      var file = new File([blob], 'video.mp4', {type: 'video/mp4'});
      this.state.myDropzone.addFile(file);

      this.setState({recordRTC: null});
    });

    this.onVideoButton();
  }

  stopRecordHotkey(e) {
    if(e.keyCode == 83) {
      this.stopRecord();
    }
  }

  createDropzone() {
    Dropzone.autoDiscover = false;
    Dropzone.options.myDropzone = {
      clickable: false,
      acceptedFiles: 'image/*,video/mp4,video/webm',
      dictDefaultMessage: 'All Done',
      init: function() {
        this.on('success', function(file, res) {
          this.removeFile(file);
        });
      }
    };
    this.setState({myDropzone: new Dropzone('div#my-dropzone', {url: '/'})});
  }

  componentDidMount() {
    var toggleCam = getID('toggle-cam');
    toggleCam.addEventListener('click', this.cameraRequest);

    this.createDropzone();
  }

  render() {
    return (
      <div className="container">
        <div className="row m-t-sm">
          <div className="col-xs-6 col-xs-offset-3">
            <div className="embed-responsive embed-responsive-16by9">
              <video id="camera" className="embed-responsive-item bg-grey"></video>
            </div>
          </div>
        </div>

        <div className="row m-t-sm text-center">
          <div className="col-xs-2 col-xs-offset-3">
            <button id="toggle-cam" className="btn btn-info" autoFocus>Use webcam</button>
          </div>

          <div className="col-xs-2">
            <button id="take-photo" className="btn btn-primary" disabled>Take photo</button>
          </div>

          <div className="col-xs-2">
            <button id="record-video" className="btn btn-success" disabled>Start record</button>
          </div>
        </div>

        <div className="row m-t-sm">
          <div id="my-dropzone" className="dropzone"></div>
        </div>

        <Copy />
      </div>
    );
  }
}

ReactDOM.render(<Init />, getID('wrapper'));
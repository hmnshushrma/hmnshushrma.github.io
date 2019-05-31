;(function () {
  var width = 900 // We will scale the photo width to this
  var height = 0 // This will be computed based on the input stream
  var streaming = false
  var video = null
  var canvas = null
  var photo = null
  var startbutton = null
  //
  // function gotDevices(mediaDevices) {
  //   select.innerHTML = '';
  //   select.appendChild(document.createElement('option'));
  //   let count = 1;
  //   mediaDevices.forEach(mediaDevice => {
  //     if (mediaDevice.kind === 'videoinput') {
  //       const option = document.createElement('option');
  //       option.value = mediaDevice.deviceId;
  //       const label = mediaDevice.label || `Camera ${count++}`;
  //       const textNode = document.createTextNode(label);
  //       option.appendChild(textNode);
  //       select.appendChild(option);
  //     }
  //   })

  function getSecondoryCam (mediaDevices) {
    console.log(mediaDevices)
  }

  function startup () {
    video = document.getElementById('video')
    canvas = document.getElementById('canvas')
    photo = document.getElementById('photo')
    select = document.getElementById('select')
    startbutton = document.getElementById('startbutton')

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(function (stream) {
        video.srcObject = stream
        video.play()
      })

      .catch(function (err) {
        console.log('An error occurred: ' + err)
      })

    video.addEventListener(
      'canplay',
      function (ev) {
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth / width)
          if (isNaN(height)) {
            height = width / (4 / 3)
          }

          video.setAttribute('width', width)
          video.setAttribute('height', height)
          canvas.setAttribute('width', width)
          canvas.setAttribute('height', height)
          streaming = true
        }
      },
      false
    )

    startbutton.addEventListener(
      'click',
      function (ev) {
        takepicture()
        ev.preventDefault()
      },
      false
    )

    clearphoto()
  }
  function clearphoto () {
    var context = canvas.getContext('2d')
    context.fillStyle = '#AAA'
    context.fillRect(0, 0, canvas.width, canvas.height)

    var data = canvas.toDataURL('image/png')
    photo.setAttribute('src', data)
  }

  function takepicture () {
    var context = canvas.getContext('2d')
    if (width && height) {
      canvas.width = width
      canvas.height = height
      context.drawImage(video, 0, 0, width, height)

      var data = canvas.toDataURL('image/png')
      photo.setAttribute('src', data)
    } else {
      clearphoto()
    }
  }

  window.addEventListener('load', startup, false)
  navigator.mediaDevices.enumerateDevices().then(getSecondoryCam)
})()

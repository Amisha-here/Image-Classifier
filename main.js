const image = document.getElementById('image'); // The image we want to classify
const dropContainer = document.getElementById('container');
const warning = document.getElementById('warning');
const fileInput = document.getElementById('fileUploader');

function preventDefaults(e) {
  e.preventDefault()
  e.stopPropagation()
};

['dragenter', 'dragover'].forEach(eventName => {
  dropContainer.addEventListener(eventName, e => dropContainer.classList.add('highlight'), false)
});

['dragleave', 'drop'].forEach(eventName => {
  dropContainer.addEventListener(eventName, e => dropContainer.classList.remove('highlight'), false)
});

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropContainer.addEventListener(eventName, preventDefaults, false)
});

dropContainer.addEventListener('drop', gotImage, false)

function gotImage(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  if (files.length > 1) {
    console.error('upload only one file');
  }
  const file = files[0];
  const imageType = /image.*/;
  if (file.type.match(imageType)) {
    warning.innerHTML = '';
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      image.src = reader.result;
      setTimeout(classifyImage, 100);
    }
  } else {
    image.src = 'images/bird.jpg';
    setTimeout(classifyImage, 100);
    warning.innerHTML = 'Please drop an image file.'
  }
}

function handleFiles() {
  const curFiles = fileInput.files;
  if (curFiles.length === 0) {
    image.src = 'images/bird.jpg';
    setTimeout(classifyImage, 100);
    warning.innerHTML = 'No image selected for upload';
  } else {
    image.src = window.URL.createObjectURL(curFiles[0]);
    warning.innerHTML = '';
    setTimeout(classifyImage, 100);
  }
}

function clickUploader() {
  fileInput.click();
}

const result = document.getElementById('result'); 
const probability = document.getElementById('probability'); 

const classifier = ml5.imageClassifier('Mobilenet', () => {});

// Make a prediction with the selected image
// This will return an array with a default of 10 options with their probabilities
classifyImage();

function classifyImage() {
  classifier.predict(image, (err, results) => {
    let resultTxt = results[0].className;
    result.innerText = resultTxt;
    let prob = 100 * results[0].probability;
    probability.innerText = Number.parseFloat(prob).toFixed(2) + '%';
  });
}


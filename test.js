function printToDom (string, id) {
  document.getElementById(id).innerHTML += string;
}

function getData () {
  var myRequest = new XMLHttpRequest();
  myRequest.addEventListener('load', successFunction);
  myRequest.addEventListener('error', errorFunction);
  myRequest.open('GET', 'https://api.jotform.com/form/80976803957978/submissions?apiKey=76718df06c04f5aa6d1385b9bb91032b');
  myRequest.send();
};

function successFunction () {
  var responseData = JSON.parse(this.responseText).content;

  let data = isApproved(responseData);

  var imgTypes = ['jpg', 'jpeg', 'png', 'gif'];
  var audioTypes = ['mp3', 'wma'];
  var videoTypes = ['mpg', 'flv', 'avi', 'mpeg', 'mpv', 'mov', 'rm', 'mp4', '3gp'];

  for (let i = 0; i < data.length; i++) {
    var source = data[i].answers[9].answer[0];
    var ext = getFileExtension(source);
    if (imgTypes.indexOf(ext) > -1) {
      buildImageCard(data[i]);
    } else if (videoTypes.indexOf(ext) > -1) {
      buildVideoCard(data[i]);
    } else if (audioTypes.indexOf(ext) > -1) {
      buildAudioCard(data[i]);
    }
  }
  addCarouselImages();
};

function isApproved (data) {
  let newArray = [];
  data.forEach(function (item) {
    if (item.answers[13].answer == 'Approved') {
      newArray.push(item);
    }
  });
  return newArray;
}

function errorFunction () {
  console.error('Something went wrong');
};

function getFileExtension (fname) {
  if (typeof fname ===  'string') {
    return fname.substr(fname.lastIndexOf('.') + 1).toLowerCase();
  }
};

function buildImageCard (entryData) {
  var domString = '';

  var presource = entryData.answers[9].answer[0];
  var source = checkSource(presource);
  var post = entryData.answers[4].answer;
  var name = entryData.answers[3].answer;

  domString += '<div class="entry">';
  if (source !== '') {
    domString +=  '<img class="media" data-src="' + source + '" alt="">';
  }
  domString +=  '<h3>' + name + '</h3>';
  domString +=  '<p>' + post + '</p>';
  domString += '</div>';

  printToDom(domString, 'outputDiv');
}

function checkSource (url) {
  return url.split(' ').join('%20');
}

function addCarouselImages (dataArray) {
  var carouselImages = document.getElementsByClassName('media');
  var imgArray = Array.from(carouselImages);
  for (let i = 0; i < imgArray.length; i++) {
    var src = imgArray[i].getAttribute('data-src');
    if (src != undefined) {
      imgArray[i].style.backgroundImage = 'url(' + src + ')';
    }
  }
}

function buildAudioCard (entryData) {
  var domString = '';

  var source = entryData.answers[9].answer[0];
  var post = entryData.answers[4].answer;
  var name = entryData.answers[3].answer;

  domString += '<div class="entry">';
  if (source !== '') {
    domString +=  '<audio class="media" src="' + source + '" alt=""></audio>';
  }
  domString +=  '<h3>' + name + '</h3>';
  domString +=  '<p>' + post + '</p>';
  domString += '</div>';

  printToDom(domString, 'outputDiv');
};

function buildVideoCard (entryData) {
  var domString = '';

  var source = entryData.answers[9].answer[0];
  var post = entryData.answers[4].answer;
  var name = entryData.answers[3].answer;

  domString += '<div class="entry">';
  if (source !== '') {
    domString +=  '<video controls class="media" src="' + source + '" alt="">/video>';
  }
  domString +=  '<h3>' + name + '</h3>';
  domString +=  '<p>' + post + '</p>';
  domString += '</div>';

  printToDom(domString, 'outputDiv');
};

getData();

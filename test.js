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

  var approvedData = isApproved(responseData);

  var data = selectNumber(approvedData);

  var imgTypes = ['jpg', 'jpeg', 'png', 'gif'];
  var audioTypes = ['mp3', 'wma'];
  var videoTypes = ['mpg', 'flv', 'avi', 'mpeg', 'mpv', 'mov', 'rm', 'mp4', '3gp'];

  var uploadFileIndex = findIndex(data[0].answers, 'control_fileupload');

  for (let i = 0; i < data.length; i++) {
    var source = data[i].answers[uploadFileIndex].answer[0];
    var ext = getFileExtension(source);
    if (imgTypes.indexOf(ext) > -1) {
      buildImageCard(data[i]);
    } else if (videoTypes.indexOf(ext) > -1) {
      buildVideoCard(data[i]);
    } else if (audioTypes.indexOf(ext) > -1) {
      buildAudioCard(data[i]);
    } else {
      buildRegularCard(data[i]);
    }
  }
  addCarouselImages();
};

function findIndex (data, id) {
  var value = traverse(data, id);
  var property = data.getKeyByValue(value);
  return property
};

Object.prototype.getKeyByValue = function( value ) {
  for( var prop in this ) {
      if( this.hasOwnProperty( prop ) ) {
           if( this[ prop ] === value )
               return prop;
      }
  }
}

function traverse (data, id) {
  if (typeof data == "object") {
    Object.entries(data).forEach(function([key, value]) {
      if(key=="type" && value==id) {
        return value;
      }

      traverse(value);
    });
  }
}

function selectNumber (dataArray) {
  return dataArray.slice(0, 15);
}

function buildRegularCard (entryData) {
  var domString = '';

  var post = entryData.answers[4].answer;
  var name = entryData.answers[3].answer;

  domString += '<div class="entry">';
  domString +=  '<h3>' + name + '</h3>';
  domString +=  '<p>' + post + '</p>';
  domString += '</div>';

  printToDom(domString, 'outputDiv');
}

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
  for (let i = 0; i < carouselImages.length; i++) {
    var src = carouselImages[i].getAttribute('data-src');
    if (src != undefined) {
      carouselImages[i].style.backgroundImage = 'url(' + src + ')';
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

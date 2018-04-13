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
  var data = JSON.parse(this.responseText).content;
  console.log(data);

  var imgTypes = ['jpg', 'jpeg', 'png', 'gif'];
  var audioTypes = ['mp3', 'wma'];
  var videoTypes = ['mpg', 'flv', 'avi', 'mpeg', 'mpv', 'mov', 'rm', 'mp4', '3gp'];

  data.forEach(item => {
    var source = item.answers[9].answer[0];
    var ext = getFileExtension(source);
    if (imgTypes.indexOf(ext) > -1) {
      buildImageCard(item);
    } else if (videoTypes.indexOf(ext) > -1) {
      buildVideoCard(item);
    } else if (audioTypes.indexOf(ext) > -1) {
      buildAudioCard(item);
    }
  });
};

function errorFunction () {
  console.error('Something went wrong');
};

function getFileExtension (fname) {
  if (typeof fname ===  'string') {
    return fname.substr(fname.lastIndexOf('.') + 1).toLowerCase();
  }
};

function buildImageCard (entryData) {
  var source = entryData.answers[9].answer[0];
  var post = entryData.answers[4].answer;
  var name = entryData.answers[3].answer;

  var domString = '';
  domString += "<div class='container-fluid'></div>";
  domString += `<div class="panel panel-default">`;
  domString +=  `<div class="panel-heading">`;
  domString +=    `<h3 class="panel-title">Panel title</h3>`;
  domString +=  `</div>`;
  domString +=  `<div class="panel-body">`;
  domString +=    `Panel content`;
  domString +=  `</div>`;
  domString += `</div>`;

  printToDom(domString, 'outputDiv');
};

function buildAudioCard (entryData) {
  var source = entryData.answers[9].answer[0];
  var ext = getFileExtension(entryData);

  var domString = '';
  domString += "<audio src='" + source + "'></audio>";

  printToDom(domString, 'outputDiv');
};

function buildVideoCard (entryData) {
  var source = entryData.answers[9].answer[0];
  var ext = getFileExtension(entryData);

  var domString = '';
  domString += "<video type='video/mov' controls width='700' height='344' src='" + source + "'></video>";

  printToDom(domString, 'outputDiv');
};

getData();

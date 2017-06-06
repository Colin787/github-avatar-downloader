const req = require('request');
const fs = require('fs');
const GITHUB_USER = "colin787";
const GITHUB_TOKEN = "53bbfa62c5ef5fd1cb930c444697876b9550dc14";
var dir = './imgs/';
var repoOwner = process.argv[2];
var repoName = process.argv[3];
var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';

function getRepoContributors(cb) {
  var options = {
    url: requestURL,
    json: true,
    headers: {
      'User-Agent' : 'LHL Project'
    }
  };
  req.get(options, function(err, response, body){
    cb(err, body);
  });
}
getRepoContributors(function(err, result){
  if(repoOwner && repoName) {
    result.forEach(function(item, index, arr){
      downloadImageByURL(item.avatar_url, dir + item.login);
    });
  }
});

function downloadImageByURL(url, filepath){
  req.get(url)
      .on('error', function(err){
        throw err;
      })
      .on('response', function(response){
        let type = response.headers['content-type'].substring(6);
        filepath += "." + type;
        console.log('Downloading' + filepath);

      })
      .pipe(fs.createWriteStream(filepath))
      .on('finish', function(){
        console.log('Download complete: ' + filepath)
      });
}







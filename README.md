# youtube-video-status

gotcha youtube video status without creaking

[![Travis build status](http://img.shields.io/travis/jkiimm/youtube-video-status.svg?style=flat)](https://travis-ci.org/jkiimm/youtube-video-status)
[![Code Climate](https://codeclimate.com/github/jkiimm/youtube-video-status/badges/gpa.svg)](https://codeclimate.com/github/jkiimm/youtube-video-status)
[![Test Coverage](https://codeclimate.com/github/jkiimm/youtube-video-status/badges/coverage.svg)](https://codeclimate.com/github/jkiimm/youtube-video-status)
[![Dependency Status](https://david-dm.org/jkiimm/youtube-video-status.svg)](https://david-dm.org/jkiimm/youtube-video-status)
[![devDependency Status](https://david-dm.org/jkiimm/youtube-video-status/dev-status.svg)](https://david-dm.org/jkiimm/youtube-video-status#info=devDependencies)

## Installation

```sh
$ npm install youtube-video-status --save
```

## Example

### ES5

```javascript
var video = require('youtube-video-status');

video.status('VIDEO_ID').then(function (status) {
  var igotcha = status;
  console.log(igotcha);
});
```

### ES6

```javascript
import video from 'youtube-video-status';

video.status('VIDEO_ID').then((status) => {
  const igotcha = status;
  console.log(igotcha);
});
```


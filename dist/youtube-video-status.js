'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.detectStatus = exports.getResourceText = exports.status = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getResourceText(vid) {
  var selectors, options, $, $text;
  return _regenerator2.default.async(function getResourceText$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          selectors = {
            main: '#unavailable-message',
            sub: '#unavailable-submessage'
          };
          options = {
            uri: 'https://www.youtube.com/watch',
            headers: { 'accept-language': 'en' },
            qs: { v: vid },
            transform: function transform(body) {
              return _cheerio2.default.load(body);
            }
          };
          _context.next = 4;
          return _regenerator2.default.awrap((0, _requestPromise2.default)(options));

        case 4:
          $ = _context.sent;
          $text = _ramda2.default.pipe($, _ramda2.default.invoker(0, 'text'));
          return _context.abrupt('return', _ramda2.default.evolve({ main: $text, sub: $text }, selectors));

        case 7:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}

function status(vid) {
  var obj;
  return _regenerator2.default.async(function status$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return _regenerator2.default.awrap(getResourceText(vid));

        case 2:
          obj = _context2.sent;
          return _context2.abrupt('return', detectStatus(obj));

        case 4:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
}

function detectStatus(obj) {
  var combined = obj.main + obj.sub;
  var isPrivate = _ramda2.default.test(/private/i);
  var isAccessible = _ramda2.default.both(_ramda2.default.test(/unavailable/i), _ramda2.default.complement(_ramda2.default.test(/sorry/i)));
  var isUnavailable = _ramda2.default.either(_ramda2.default.test(/not exist/i), _ramda2.default.both(_ramda2.default.test(/unavailable/i), _ramda2.default.test(/sorry/i)));

  return _ramda2.default.cond([[isPrivate, _ramda2.default.always('private')], [isAccessible, _ramda2.default.always('accessible')], [isUnavailable, _ramda2.default.always('unavailable')], [_ramda2.default.T, _ramda2.default.always('unknown')]])(combined);
}

var video = {
  status: status,
  getResourceText: getResourceText,
  detectStatus: detectStatus
};

exports.default = video;
exports.status = status;
exports.getResourceText = getResourceText;
exports.detectStatus = detectStatus;
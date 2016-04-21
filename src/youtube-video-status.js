import R from 'ramda';
import request from 'request-promise';
import cheerio from 'cheerio';

async function getResourceText(vid) {
  const selectors = {
    main: '#unavailable-message',
    sub: '#unavailable-submessage'
  };

  const options = {
    uri: 'https://www.youtube.com/watch',
    headers: { 'accept-language': 'en' },
    qs: { v: vid },
    transform: (body) => cheerio.load(body)
  };

  const $ = await request(options);
  const $text = R.pipe($, R.invoker(0, 'text'));

  return R.evolve({ main: $text, sub: $text }, selectors);
}

async function status(vid) {
  const obj = await getResourceText(vid);
  return detectStatus(obj);
}

function detectStatus(obj) {
  const combined = obj.main + obj.sub;
  const isPrivate = R.test(/private/i);
  const isAccessible = R.both(R.test(/unavailable/i), R.complement(R.test(/sorry/i)));
  const isUnavailable = R.either(R.test(/not exist/i), R.both(R.test(/unavailable/i), R.test(/sorry/i)));

  return R.cond([
    [isPrivate, R.always('private')],
    [isAccessible, R.always('accessible')],
    [isUnavailable, R.always('unavailable')],
    [R.T, R.always('unknown')]
  ])(combined);
}

const video = {
  status,
  getResourceText,
  detectStatus,
};

export default video;
export { status, getResourceText, detectStatus };

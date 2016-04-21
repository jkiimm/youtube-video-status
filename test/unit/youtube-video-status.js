import 'should';
import nock from 'nock';
import video from '../../src/youtube-video-status';

describe('video', () => {
  before(() => nock.disableNetConnect());
  after(() => nock.enableNetConnect());

  it('should be able to be imported as same both of CommonJS and ES6', () => {
    const videoCommonJS = require('../../src/youtube-video-status');
    Object.keys(video).forEach((key) => video[key].should.eql(videoCommonJS[key]));
  });

  describe('getResourceText', () => {
    beforeEach(() => nock.cleanAll());
    afterEach(() => nock.cleanAll());

    it('should text of resources by selector', (done) => {
      const f = video.getResourceText;
      const scope = nock('https://www.youtube.com')
        .get('/watch')
        .query({ v: 'accessible' })
        .replyWithFile(200, './test/fixtures/accessible.html')
        .get('/watch')
        .query({ v: 'private' })
        .replyWithFile(200, './test/fixtures/private.html')
        .get('/watch')
        .query({ v: 'unavailable' })
        .replyWithFile(200, './test/fixtures/unavailable.html');

      f('accessible')
        .then((obj) => {
          obj.should.have.properties(['main', 'sub']);
          obj.main.should.match(/unavailable/i);
          obj.sub.trim().should.be.empty();
          return f('private');
        })
        .then((obj) => {
          obj.should.have.properties(['main', 'sub']);
          obj.main.should.match(/warning/i);
          obj.sub.should.match(/private/i);
          return f('unavailable');
        })
        .then((obj) => {
          obj.should.have.properties(['main', 'sub']);
          obj.main.should.match(/not exist/i);
          obj.sub.should.match(/sorry/i);
          scope.done();
          done();
        })
        .catch(done);
    });
  });

  describe('detectStatus', () => {
    it('should detect accessible status', () => {
      const f = video.detectStatus;
      const obj = { main: 'This video is unavailable.', sub: '  ' };
      f(obj).should.eql('accessible');
    });

    it('should detect private status', () => {
      const f = video.detectStatus;
      const obj = { main: 'Content Warning', sub: 'This video is private.' };
      f(obj).should.eql('private');
    });

    it('should detect unavailable status', () => {
      const f = video.detectStatus;
      const obj = { main: 'This video does not exist.', sub: 'Sorry about that.' };
      f(obj).should.eql('unavailable');
    });

    it('should mark status as unknown when have no expected infomation', () => {
      const f = video.detectStatus;
      const obj = { main: 'unexpected main-message', sub: 'unexpected sub-message' };
      f(obj).should.eql('unknown');
    });
  });
});

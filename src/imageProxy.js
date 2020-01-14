const https = require('https');
const PixelStream = require('pixel-stream');
const neuquant = require('neuquant');
const GifDecoder = require('gif-stream/decoder');
const GifEncoder = require('gif-stream/encoder');
const inherits = require('util').inherits;

function ConcatFrames(callback) {
  if (!(this instanceof ConcatFrames)) return new ConcatFrames(callback);

  PixelStream.call(this);

  this.frame = null;
  this.buffers = [];
  this.callback = callback;

  // put the stream in flowing mode
  this.resume();
}

inherits(ConcatFrames, PixelStream);

ConcatFrames.prototype._startFrame = function(frame, done) {
  frame.width = frame.width || this.format.width;
  frame.height = frame.height || this.format.height;
  frame.colorSpace = this.format.colorSpace;

  if (!frame.palette && this.format.palette)
    frame.palette = this.format.palette;

  this.frame = frame;
  this.buffers = [];
  done();
};

ConcatFrames.prototype._writePixels = function(data, done) {
  this.buffers.push(data);
  done();
};

ConcatFrames.prototype._endFrame = function(done) {
  this.frame.pixels = Buffer.concat(this.buffers);
  this.callback(this.frame);
  done();
};

ConcatFrames.prototype._end = function(done) {
  done();
};

const MAX_REDIRECT_DEPTH = 5;

function getWithRedirect(url, cb, depth = 1) {
  return https.get(url, resp => {
    if (
      resp.statusCode > 300 &&
      resp.statusCode < 400 &&
      resp.headers.location &&
      depth < MAX_REDIRECT_DEPTH
    ) {
      getWithRedirect(resp.headers.location, cb, depth + 2);
    } else {
      cb(resp);
    }
  });
}

export const firstFrame = (req, res) => {
  const url = req.params.url;
  // TODO: ensure image comes from github
  // if (!url.startsWith('https://user-images.githubusercontent.com')) {
  //   res.sendStatus(400);
  //   return;
  // }

  getWithRedirect(url, resp => {
    const decodePipe = resp.pipe(new GifDecoder());
    decodePipe.pipe(
      ConcatFrames(function(frame) {
        resp.req.abort();
        decodePipe.destroy();
        const q = neuquant.quantize(frame.pixels);
        const enc = new GifEncoder(frame.width, frame.height, {
          palette: q.palette,
        });
        res.status(200);
        res.set('Cache-Control', 'public, max-age=2592000, s-maxage=2592000');
        res.set('Content-Type', 'image/gif');
        enc.pipe(res);
        enc.end(q.indexed);
      }),
    );
  });
};

export const imageProxy = (req, res) => {
  const url = req.params.url;

  getWithRedirect(url, resp => {
    res.status(resp.statusCode);
    for (const k of Object.keys(resp.headers)) {
      const lowerK = k.toLowerCase();
      if (lowerK === 'content-type' || lowerK === 'content-length') {
        res.set(k, resp.headers[k]);
      }
    }
    res.set('Cache-Control', 'public, max-age=2592000, s-maxage=2592000');
    resp.on('data', chunk => {
      res.write(chunk);
    });

    resp.on('end', () => {
      res.end();
    });
  }).on('error', err => {
    res.sendStatus(500);
    console.log('Error: ' + err.message);
  });
};

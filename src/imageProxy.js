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

ConcatFrames.prototype._startFrame = function (frame, done) {
  frame.width = frame.width || this.format.width;
  frame.height = frame.height || this.format.height;
  frame.colorSpace = this.format.colorSpace;

  if (!frame.palette && this.format.palette)
    frame.palette = this.format.palette;

  this.frame = frame;
  this.buffers = [];
  done();
};

ConcatFrames.prototype._writePixels = function (data, done) {
  this.buffers.push(data);
  done();
};

ConcatFrames.prototype._endFrame = function (done) {
  this.frame.pixels = Buffer.concat(this.buffers);
  this.callback(this.frame);
  done();
};

ConcatFrames.prototype._end = function (done) {
  done();
};

const MAX_REDIRECT_DEPTH = 5;

export function getWithRedirect(url, cb, depth = 1) {
  return https.get(url, (resp) => {
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

function padBase64String(input: string): string {
  const segmentLength = 4;
  const stringLength = input.length;
  const diff = stringLength % segmentLength;

  if (!diff) {
    return input;
  }

  const pad = ''.padStart(diff, '=');

  return `${input}${pad}`;
}

function decodeUrl(base64Url) {
  return Buffer.from(
    padBase64String(base64Url).replace(/-/g, '+').replace(/_/g, '/'),
    'base64',
  ).toString('utf-8');
}

function isGitHubUrl(url: string): boolean {
  const host = new URL(url).host;
  const parts = host.split('.');
  return (
    parts.length >= 2 &&
    parts[parts.length - 1] === 'com' &&
    ['github', 'githubusercontent'].includes(parts[parts.length - 2])
  );
}

// workaround for netlify (res.redirect is broken)
function redirect(res, statusOrUrl, url) {
  if (typeof statusOrUrl === 'string') {
    url = statusOrUrl;
    statusOrUrl = 307;
  }
  if (typeof statusOrUrl !== 'number' || typeof url !== 'string') {
    throw new Error(
      `Invalid redirect arguments. Please use a single argument URL, e.g. res.redirect('/destination') or use a status code and URL, e.g. res.redirect(307, '/destination').`,
    );
  }
  res.writeHead(statusOrUrl, {Location: url});
  res.end();
  return res;
}

export const firstFrame = (req, res) => {
  const url = decodeUrl(req.params.base64Url);

  if (!isGitHubUrl(url)) {
    console.warn('Non-GitHub url, redirecting', url);
    redirect(res, url);
    return;
  }

  getWithRedirect(url, (resp) => {
    const decodePipe = resp.pipe(new GifDecoder());
    decodePipe.pipe(
      ConcatFrames(function (frame) {
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

export const proxyImage = (res, url) => {
  if (!isGitHubUrl(url)) {
    console.warn('Non-GitHub url, redirecting', url);
    redirect(res, url);
    return;
  }

  return new Promise((resolve, reject) => {
    getWithRedirect(url, (resp) => {
      let contentLength;
      for (const k of Object.keys(resp.headers)) {
        if (k.toLowerCase() === 'content-length') {
          contentLength = parseInt(resp.headers[k], 10);
        }
      }
      if (contentLength && contentLength >= 4500000) {
        // Lambda can't handle anything larger than 5mb, so we'll redirect to the original url instead
        redirect(res, url);
      } else {
        res.status(resp.statusCode);
        for (const k of Object.keys(resp.headers)) {
          const lowerK = k.toLowerCase();
          if (lowerK === 'content-type' || lowerK === 'content-length') {
            res.set(k, resp.headers[k]);
          }
        }
        res.set('Cache-Control', 'public, max-age=2592000, s-maxage=2592000');
        resp.on('data', (chunk) => {
          res.write(chunk);
        });

        resp.on('end', () => {
          res.end();
          resolve();
        });
      }
    }).on('error', (err) => {
      res.send('Error');
      res.status(500);
      reject(err);
    });
  });
};

export const imageProxy = async (req, res) => {
  const url = decodeUrl(req.params.base64Url);
  await proxyImage(res, url);
  return;
};

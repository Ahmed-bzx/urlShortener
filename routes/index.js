const express = require('express');
const validUrl = require('valid-url');
const shortid = require('shortid');
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$&');
const router = express.Router();

// Mongoose Model
const Link = require('../models/link');

router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/new/:url(*)', (req, res, next) => {
  let url = req.params.url;
  let host = req.hostname + '/';

  // Check URL validation
  if (validUrl.isUri(url)) {
    // Check if URL is exist
    Link.getLink({ originalUrl: url }, (err, link) => {
      if (err) throw err;
      if (link) {
        // if URL exist send JSON
        console.log('LINK EXIST');
        res.json({ "original_url": link.originalUrl, "short_url": host + link.shortId });
      } else {
        // if NOT, make a new SHORT URL and save it then send JSON
        console.log('LINK NOT EXIST, MAKE NEW ONE');
        let shortId = shortid.generate();
        let newUrl = { originalUrl: url, shortId: shortId };
        Link.addLink(newUrl, (err, link) => {
          res.json({ "original_url": link.originalUrl, "short_url": host + link.shortId });
        });
      }
    });
  } else {
    res.json({ "error": "URL is invalid" });
  }
});

router.get('/:shortId', (req, res, next) => {
  let shortId = req.params.shortId;
  // Get the real URL form DB
  Link.getLink({ shortId: shortId }, (err, link) => {
    if (link) {
      let originalUrl = link.originalUrl;
      res.redirect(originalUrl);
    } else {
      res.json({ "error": "Short URL is invalid" });
    }
  });
});

module.exports = router;

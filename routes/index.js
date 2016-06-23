require('seedrandom');

import Canvas from 'canvas';
import request from 'request-promise';

//  -- canvas --
const canvasOpts = {
  canvasM: 100,
  perRow: 6,
  fillPerc: 0.4,
};
const canvas = new Canvas(canvasOpts.canvasM, canvasOpts.canvasM);
const ctx = canvas.getContext('2d');
const mulW = canvasOpts.canvasM / canvasOpts.perRow;
const mulH = canvasOpts.canvasM / (canvasOpts.perRow + 1);


//  -- get random color palette --
const getColors = () => request({ uri: 'http://www.colourlovers.com/api/palettes/top?format=json&numResults=100&hueRange=0,359', json: true });


module.exports = {
  index: (req, res) => {
    res.render('index', {});
    return;
  },

  create: async (req, res) => {
    const params = req.body;
    if (!params.email) {
      throw new Error('Missing e-mail');
    }
    Math.seedrandom(params.email);

    let palette;
    try {
      palette = await getColors();
    } catch (e) {
      throw new Error(e);
    }

    const userPalette = palette[Math.floor((Math.random() * palette.length))];
    res.send(`<pre>${JSON.stringify(userPalette.colors, null, 2)}</pre>`);
  },
};

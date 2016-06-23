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

    let userPalette = palette[Math.floor((Math.random() * palette.length))].colors;
    userPalette = userPalette.map((c) => `#${c}`);

    ctx.rect(0, 0, canvasOpts.canvasM, canvasOpts.canvasM);
    ctx.fillStyle = userPalette[Math.floor((Math.random() * userPalette.length))];
    ctx.fill();

    for (let c = 0; c <= canvasOpts.perRow; c++) {
      for (let r = 0; r <= canvasOpts.perRow; r++) {
        let reverse = r;

        if (c % 2 === 0) {
          reverse = reverse - 0.5;
        }

        if (Math.random() > (1 - canvasOpts.fillPerc)) {
          ctx.beginPath();
          ctx.moveTo(((reverse - 0.5) * mulW), (c * mulH));
          ctx.lineTo(((reverse + 0.5) * mulW), (c * mulH));
          ctx.lineTo((reverse * mulW), ((c + 1) * mulH));


          ctx.fillStyle = userPalette[Math.floor((Math.random() * userPalette.length))];
          ctx.fill();
          ctx.closePath();
        }

        if (Math.random() > (1 - canvasOpts.fillPerc)) {
          ctx.beginPath();
          ctx.moveTo(((reverse + 1) * mulW), ((c + 1) * mulH));
          ctx.lineTo(((reverse + 0.5) * mulW), (c * mulH));
          ctx.lineTo((reverse * mulW), ((c + 1) * mulH));

          ctx.fillStyle = userPalette[Math.floor((Math.random() * userPalette.length))];
          ctx.fill();
          ctx.closePath();
        }
      }
    }
    res.send(`<img src="${canvas.toDataURL()}" />`);
  },
};

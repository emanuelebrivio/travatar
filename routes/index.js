require('seedrandom');

import Canvas from 'canvas';
import request from 'request-promise';


module.exports = {
  index: (req, res) => {
    res.render('index', {});
    return;
  },
};

require('babel-register');

import express from 'express';
import path from 'path';
import stylus from 'stylus';
import nib from 'nib';
import rupture from 'rupture';
import logger from 'morgan';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import errorHandler from 'errorhandler';
import routes from './routes/index';


const app = express();


app
  .set('port', process.env.PORT || 3000)
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'pug')
  .set('x-powered-by', false);


app
  .use(
    stylus.middleware({
      src: path.join(__dirname, 'public'),
      compile: (str, stylPath) => (
        stylus(str)
          .set('filename', stylPath)
          .set('compress', true)
          .use(nib())
          .use(rupture())
      ),
    })
  )
  // .use(favicon('path/to/ico')) /* make sure to have your ico if uncomment this row otherwise express throw an error */
  .use(logger('dev'))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(methodOverride())
  .use(express.static(path.join(__dirname, 'public')))
  .use(errorHandler());


app.route('/').get(routes.index);

const PORT = app.get('port');

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express server listening on port ${PORT}.`);
});
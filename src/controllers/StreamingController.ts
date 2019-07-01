import express from 'express';
import expressWS from 'express-ws';
import constants from '../lib/constants';

export default (db, emitter) => {
  const StreamingController: any = express.Router();
  expressWS(StreamingController);

  StreamingController.ws('/', ws => {
    const listener = ([attributes]) => {
      ws.send(JSON.stringify(attributes), error => {
        console.error(error);
      });
    };
    const ping = setInterval(() => {
      ws.send('ping');
    }, 15000);
    emitter.addListener(constants.STREAM_CRAWL_EVENT, listener);
    ws.on('close', () => {
      clearTimeout(ping);
      emitter.removeListener(constants.STREAM_CRAWL_EVENT, listener);
    });
  });

  return StreamingController;
};

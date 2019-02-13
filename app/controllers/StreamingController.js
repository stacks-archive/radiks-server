const express = require('express');
const expressWS = require('express-ws');
const { STREAM_CRAWL_EVENT } = require('../lib/constants');

module.exports = (db, emitter) => {
  // changeStream.on('change', (event) => {
  //   console.log(event);
  //   emitter.emit(EVENT_NAME, [event]);
  // });

  const StreamingController = express.Router();
  expressWS(StreamingController);

  // const StreamingController = expressWS(express.Router());

  StreamingController.ws('/', (ws, req) => {
    const listener = ([attributes]) => {
      console.log('attrs for streaming', attributes);
      ws.send(JSON.stringify(attributes), (error) => {
        console.error(error);
      });
    };
    ws.on('open', () => {
      emitter.addListener(STREAM_CRAWL_EVENT, listener);
    });
    ws.on('close', () => {
      emitter.removeListener(STREAM_CRAWL_EVENT, listener);
    });
    // emitter.addListener(EVENT_NAME, (event) => {
    //   ws.send(event);
    // });
  });

  return StreamingController;
};

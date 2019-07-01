import express from 'express';
import expressWS from 'express-ws';
import EventEmitter from 'wolfy87-eventemitter';
import { Collection } from 'mongodb';
import constants from '../lib/constants';

export default (db: Collection, emitter: EventEmitter) => {
  const StreamingController: any = express.Router();
  expressWS(StreamingController);

  StreamingController.ws('/', (ws: any) => {
    const listener = ([attributes]: any) => {
      ws.send(JSON.stringify(attributes), (error: Error) => {
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

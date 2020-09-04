import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import http from 'http';
import cors from 'cors';
import DataBase from './models';
import * as controllers from './routes';
import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';
import Passport from './config/passport';
import socketIO from 'socket.io';
import { SocketRouter } from './socketRoutes';

class CrmServer extends Server {
  private dBase: DataBase;
  private server: http.Server;
  private io: socketIO.Server;
  private socketRouter = new SocketRouter();

  constructor() {
    super(true);
    this.dBase = new DataBase();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    // Allow any method from any host and log requests
    this.app.use(
      cors({
        credentials: true,
        ...(process.env.NODE_ENV === 'development' && { origin: process.env.WEB_URL })
      })
    );
    this.app.use(cookieParser());
    this.app.use((req, _, next) => {
      if (req.method !== 'OPTIONS') {
        Logger.Imp(`${req.ip} ${req.method} ${req.url}`);
        next();
      }
    });
    Passport.init();
    this.setupControllers();
    this.setupStaticFolders();
    this.server = http.createServer(this.app);
    this.io = socketIO(this.server);
    this.socketRouter.initSocketConnection(this.io);
  }

  private setupControllers(): void {
    const ctlrInstances = [];
    for (const name in controllers) {
      if (controllers.hasOwnProperty(name)) {
        const controller = (controllers as any)[name];
        ctlrInstances.push(new controller());
      }
    }
    super.addControllers(ctlrInstances);
  }

  private setupStaticFolders(): void {
    // Set static folder
    this.app.use(express.static(path.join(__dirname, '../../web/dist')));
    this.app.use('/images/userpic', express.static(path.join(__dirname, '../uploads/images/userpic/')));

    this.app.get('/*', (_, res) => {
      res.sendFile(path.join(__dirname, '../../web/dist/index.html'));
    });
  }

  public start(port: number): void {
    if (process.env.NODE_ENV !== 'production') {
      // Sync DB
      this.dBase.sequel
        .sync({
          // alter: true
          // force: true
        })
        .then(() => {
          this.server.listen(port, '127.0.0.1', () => {
            Logger.Info(`Server is listening on ${port}`);
          });
        });
    } else {
      this.server.listen(port, () => {
        Logger.Info(`Server is listening on ${port}`);
      });
    }
  }
}

export default CrmServer;

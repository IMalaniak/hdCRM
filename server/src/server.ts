import express, { Application, Router } from 'express';
import { Service } from 'typedi';
import { Server as SocketServer } from 'socket.io';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import http from 'http';
import cors from 'cors';

import { DataBase } from './models';
import { Routes } from './routes';
import { Passport } from './config/passport';
import { SocketRouter } from './socketRoutes';
import { Config } from './config';

@Service({ global: true })
export class Server {
  private app: Application;
  private server: http.Server;
  private socket: SocketServer;
  private router: Router;

  constructor(
    private readonly dBase: DataBase,
    private readonly routes: Routes,
    private readonly passport: Passport,
    private readonly socketRouter: SocketRouter
  ) {
    this.app = express();
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.disable('x-powered-by');
    // Allow any method from any host and log requests
    this.app.use(
      cors({
        credentials: true,
        ...(process.env.NODE_ENV === 'development' && { origin: Config.WEB_URL })
      })
    );
    this.app.use(cookieParser());
    this.app.use((req, _, next) => {
      if (req.method !== 'OPTIONS') {
        // Logger.Imp(`${req.ip} ${req.method} ${req.url}`);
        next();
      }
    });
    this.passport.init();
    this.server = http.createServer(this.app);
    this.socket = new SocketServer(this.server);
    this.socketRouter.initSocketConnection(this.socket);
    this.router = Router();
    this.app.use(this.router);

    this.setupStaticFolders();
  }

  private setupStaticFolders(): void {
    this.app.use(express.static(path.join(__dirname, '../../web/dist')));
    this.app.get('/*', (_, res) => {
      res.sendFile(path.join(__dirname, '../../web/dist/index.html'));
    });
  }

  public async start(): Promise<Application> {
    await this.routes.register(this.router);

    // Sync DB
    await this.dBase.connection.sync().then(() => {
      this.server.listen(parseInt(process.env.PORT), () => {
        // tslint:disable-next-line: no-console
        console.info(`Server is listening on ${process.env.PORT}`);
      });
    });
    return this.app;
  }
}

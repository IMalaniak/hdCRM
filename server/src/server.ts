import express, { Application, Router } from 'express';
import { Service } from 'typedi';
import { Server as SocketServer } from 'socket.io';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import http from 'http';
import cors from 'cors';
import PinoHttp from 'pino-http';

import { DataBase } from './repositories';
import { Routes } from './routes';
import { Passport } from './config/passport';
import { SocketRouter } from './socketRoutes';
import { Config } from './config';
import { Logger } from './utils/Logger';

@Service({ global: true })
export class Server {
  private readonly app: Application;
  private readonly server: http.Server;
  private readonly socket: SocketServer;
  private readonly router: Router;

  constructor(
    private readonly dBase: DataBase,
    private readonly routes: Routes,
    private readonly passport: Passport,
    private readonly socketRouter: SocketRouter,
    private readonly logger: Logger
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
    this.passport.init();
    this.server = http.createServer(this.app);
    this.app.use(
      PinoHttp({
        logger: this.logger.instance
      })
    );
    this.socket = new SocketServer(this.server);
    this.socketRouter.initSocketConnection(this.socket);
    this.router = Router();
    this.app.use(this.router);
  }

  private setupStaticFolders(): void {
    this.app.use(express.static(path.join(__dirname, '../../web/dist')));
    this.app.get('/*', (_, res) => {
      res.sendFile(path.join(__dirname, '../../web/dist/index.html'));
    });
  }

  public async start(): Promise<Application> {
    this.routes.register(this.router);
    this.setupStaticFolders();

    // Sync DB
    await this.dBase.connection.sync().then(() => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const portNumber = +process.env.PORT!;
      this.server.listen(portNumber, () => {
        this.logger.info(`Server is listening on ${portNumber}`);
      });
    });
    return this.app;
  }
}

import { Application } from 'express';
import { Service, Container } from 'typedi';

import { Server } from './server';

@Service({ global: true })
export class App {
  constructor(private readonly server: Server) {}

  public expressApp!: Application;

  public static async start(): Promise<App> {
    const application = Container.get(App);

    try {
      await application.startServer();
      return application;
    } catch (error) {
      throw error;
    }
  }

  private async startServer(): Promise<void> {
    this.expressApp = await this.server.start();
  }
}

import CrmServer from './server';
const port = parseInt(process.env.PORT);
const crmServer = new CrmServer();
crmServer.start(port);

// src/main.server.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

export default function bootstrap(_context: unknown) {
  // el context ya no se pasa a bootstrapApplication
  return bootstrapApplication(App, config);
}

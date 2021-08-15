import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import objectionSoftDelete from "objection-softdelete";
import objection from "objection";

import { AppModule } from "./app.module";

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use(helmet());
  app.use(rateLimit({ windowMs: 60, max: 50 }));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  objectionSoftDelete.register(objection);

  await app.listen(PORT);

  console.log(`Server started on port ${PORT}`);
}

bootstrap().then();

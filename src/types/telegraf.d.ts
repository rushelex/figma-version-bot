import { DocumentType } from '@typegoose/typegoose';
// import { Middleware, Context as TelegrafContext } from 'telegraf';
import { User } from '../models';

declare module 'telegraf' {
  export class Context {
    dbuser: DocumentType<User>;
  }

  // export class Composer<TContext extends Context> {
  //   action(
  //     action: string | string[] | RegExp,
  //     middleware: Middleware<TelegrafContext>,
  //     ...middlewares: Array<Middleware<TelegrafContext>>
  //   ): Composer<TContext>;
  // }
}

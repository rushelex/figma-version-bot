import mongoose from 'mongoose';
import { MONGO_URL } from '../config';

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.info('Mongoose db connected!');
  });

mongoose.set('useCreateIndex', true);

export * from './User';
export * from './Layout';

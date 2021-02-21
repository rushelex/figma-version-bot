import { DocumentType, prop, getModelForClass } from '@typegoose/typegoose';
import { Layout } from './Layout';

export class User {
  @prop({ required: true, index: true, unique: true })
  id: number;

  @prop({ type: () => Layout })
  public layouts?: Layout[];
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
});

export const getAllUsers = async (): Promise<User[]> => {
  const users: User[] = [];

  await UserModel.find((_, _users) => {
    users.push(..._users);
  });

  return users;
};

export const findUser = async (id: number): Promise<DocumentType<User>> => {
  let user = await UserModel.findOne({ id });

  if (!user) {
    try {
      user = await new UserModel({ id }).save();
    } catch (error) {
      user = await UserModel.findOne({ id });
    }
  }

  return user;
};

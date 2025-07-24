import * as bcrypt from 'bcrypt';
import { AuthRegisterRequest } from '../dtos';
import { Prisma } from '@prisma/client';


export default class AuthMapper {
  static async authSignUpRequestDTOToUserCreateInput(
    dto: AuthRegisterRequest,
  ): Promise<Prisma.UserCreateInput> {
    const password = await bcrypt.hash(dto.password, 10);

    return {
      ...dto,
      password: password,
    };
  }
}

import { JwtModuleOptions } from '@nestjs/jwt';
import Constants from 'src/constants';

const jwtConfig: JwtModuleOptions = {
  secret: Constants.Security.DEFAULT_SECRET_KEY || process.env.JWT_SECRET_KEY,
  signOptions: {
    expiresIn: '1d',
  },
};

export default jwtConfig;

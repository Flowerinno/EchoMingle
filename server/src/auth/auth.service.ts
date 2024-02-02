import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateToken } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async googleLogin(access_token: string) {
    const userInfo = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${access_token}`,
    );

    if (!userInfo) {
      return null;
    }

    const { email, name } = userInfo.data;

    let user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return user;
    }

    user = await this.prisma.user.create({
      data: {
        email,
        name,
      },
    });

    //base64 token of user.email_user.id
    const token = generateToken(user.email, user.id);

    return { id: user.id, email: user.email, name: user.name, token };
  }
}

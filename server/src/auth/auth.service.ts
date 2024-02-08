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
    let token;
    let user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      token = generateToken(user?.email, user?.id);
      return { id: user.id, email: user.email, name: user.name, token };
    }

    user = await this.prisma.user.create({
      data: {
        email,
        name,
      },
    });
    token = generateToken(user?.email, user?.id);
    return { id: user.id, email: user.email, name: user.name, token };
  }

  async login(body: { email: string }) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (!user) {
        return { message: 'User not found' };
      }

      const token = generateToken(user?.email, user?.id);

      return { id: user.id, email: user.email, name: user.name, token };
    } catch (error) {
      return { message: 'Error logging in' };
    }
  }

  async register(body: { name: string; email: string }) {
    try {
      const isExists = await this.prisma.user.findUnique({
        where: {
          email: body.email,
        },
      });

      if (isExists) {
        return { message: 'User with such email already exists' };
      }

      const user = await this.prisma.user.create({
        data: {
          email: body.email,
          name: body.name,
        },
      });

      const token = generateToken(user?.email, user?.id);

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        token,
        message: 'User registered',
      };
    } catch (error) {
      return {
        message: 'Error registering user',
      };
    }
  }

  async verifyToken(token: string) {
    const [email, id] = Buffer.from(token, 'base64').toString()?.split('_');

    if (!email || !id) return null;

    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        subscription: true,
      },
    });

    if (!user) {
      return null;
    }

    let lastSubscription;

    if (user.subscription?.length > 0) {
      lastSubscription = user.subscription.reduce((acc, curr) => {
        if (acc.expires_at < curr.expires_at) {
          return curr;
        }
        return acc;
      });
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      subscription: lastSubscription,
    };
  }
}

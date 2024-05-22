import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.findOne(createUserDto.email);
    if (user) {
      return user;
    }
    await this.prisma.user.create({
      data: {
        image: createUserDto.image,
        email: createUserDto.email,
        name: createUserDto.name,
      },
    });
    return { message: 'User created', status: 201 };
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return updateUserDto;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

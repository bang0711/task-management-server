import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createProjectDto: CreateProjectDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: createProjectDto.email,
      },
    });
    if (!user) {
      return { message: 'User not found.', status: 404 };
    }
    const newProject = await this.prisma.project.create({
      data: {
        name: createProjectDto.name,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return {
      message: 'Project created successfully.',
      status: 201,
      id: newProject.id,
    };
  }

  async findAll(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return { message: 'User not found.', status: 404 };
    }
    const projects = await this.prisma.project.findMany({
      where: {
        user: {
          id: user.id,
        },
      },
      orderBy: {
        createdTime: 'desc',
      },
    });
    return {
      content: {
        projects,
      },
      status: 200,
    };
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        user: true,
        tasks: true,
      },
    });
    if (!project) {
      return { message: 'Project not found.', status: 404 };
    }
    return { content: { project }, status: 200 };
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({
      where: {
        id,
      },
    });
    if (!project) {
      return { message: 'Project not found.', status: 404 };
    }
    await this.prisma.project.update({
      where: {
        id,
      },
      data: updateProjectDto,
    });
    return { message: 'Project updated.', status: 200 };
  }

  async remove(id: string) {
    const project = await this.prisma.project.findUnique({
      where: {
        id,
      },
    });
    if (!project) {
      return { message: 'Project not found.', status: 404 };
    }
    await this.prisma.project.delete({
      where: {
        id,
      },
    });
    return { message: 'Project deleted.', status: 200 };
  }
}

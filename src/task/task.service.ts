import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createTaskDto: CreateTaskDto) {
    const project = await this.prisma.project.findUnique({
      where: {
        id: createTaskDto.projectId,
      },
    });
    if (!project) {
      return { message: 'Project not found.', status: 404 };
    }

    await this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        project: {
          connect: project,
        },
      },
    });
    return { message: 'Task created successfully.', status: 201 };
  }

  async findAll(projectId: string) {
    const tasks = await this.prisma.task.findMany({
      where: {
        project: {
          id: projectId,
        },
      },
      orderBy: {
        createdTime: 'desc',
      },
    });
    return { content: { tasks }, status: 200 };
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: id,
      },
    });
    if (!task) {
      return { message: 'Task not found.', status: 404 };
    }
    await this.prisma.task.update({
      where: {
        id,
      },
      data: { ...updateTaskDto },
    });

    return { message: 'Task updated successfully.', status: 200 };
  }

  async remove(id: string) {
    const task = await this.prisma.task.findUnique({
      where: {
        id: id,
      },
    });
    if (!task) {
      return { message: 'Task not found.', status: 404 };
    }
    await this.prisma.task.delete({
      where: {
        id: id,
      },
    });
    return { message: 'Task deleted.', status: 200 };
  }
}

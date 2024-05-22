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
        title: createTaskDto.name,
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
    });
    return { content: { tasks }, status: 200 };
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return updateTaskDto;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}

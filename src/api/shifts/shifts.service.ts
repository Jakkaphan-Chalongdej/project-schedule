import { Injectable } from '@nestjs/common';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { DataSource } from 'typeorm';
import { ShiftsEntity } from 'src/database/entities/shifts.entity';
import { UsersEntity } from 'src/database/entities/users.entity';
import * as dayjs from 'dayjs';
import * as weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);

@Injectable()
export class ShiftsService {
  constructor(private readonly dataSource: DataSource) {}
  private readonly userRepository = this.dataSource.getRepository(UsersEntity);
  private readonly shiftsRepository =
    this.dataSource.getRepository(ShiftsEntity);

  // async onModuleInit() {
  //   await this.findAll();
  // }

  async randomUserForShift(usersPerDay: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const users = await this.userRepository.find();
      const date = dayjs();
      const week = date.week() - dayjs(date).startOf('month').week() + 1;
      const month = dayjs(date).month();
      const year = dayjs(date).year();
      for (const [index, _] of new Array(5).entries()) {
        for (const [cIndex, _] of new Array(usersPerDay).entries()) {
          const randomIndex = Math.floor(Math.random() * users.length);
          const shift = new ShiftsEntity();
          shift.dayOfWeek = index + 1;
          shift.weekOfMonth = 3;
          shift.user = users[randomIndex];
          shift.month = month + 1;
          shift.year = year;
          await queryRunner.manager.save(shift);
        }
      }
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw error;
    }
  }
  create(createShiftDto: CreateShiftDto) {
    return 'This action adds a new shift';
  }

  async findAll() {
    const shifts = await this.shiftsRepository
      .createQueryBuilder('shift')
      .select('shift.week_of_month')
      .addSelect('day_of_week')
      .addSelect('json_agg(u) as users')
      .addSelect(`json_agg("shift".*)`, 'shifts')
      .leftJoin(UsersEntity, 'u', 'shift.user_id = u.id')
      .groupBy('week_of_month, day_of_week')
      .orderBy('week_of_month, day_of_week')
      .getRawMany();

    const result = [];
    for (const shift of shifts) {
      const { shifts, week_of_month, day_of_week, users } = shift;
      const existingWeek = result.find((week) => week.week === week_of_month);
      const formatOfDay = {
        day: dayjs().day(day_of_week).format('dddd').toLowerCase(),
        users: users,
      };
      if (existingWeek) {
        existingWeek.group.push(formatOfDay);
      } else {
        const format = {
          week: week_of_month,
          month: shifts[0].month,
          year: shifts[0].year,
          group: [formatOfDay],
        };
        result.push(format);
      }
    }
    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} shift`;
  }

  update(id: number, updateShiftDto: UpdateShiftDto) {
    return `This action updates a #${id} shift`;
  }

  remove(id: number) {
    return `This action removes a #${id} shift`;
  }
}

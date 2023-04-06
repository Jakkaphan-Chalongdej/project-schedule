import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity('shifts')
export class ShiftsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'day_of_week' })
  dayOfWeek: number;

  @Column({ name: 'week_of_month' })
  weekOfMonth: number;

  @Column({ name: 'month' })
  month: number;

  @Column()
  year: number;

  @ManyToOne(() => UsersEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;
}

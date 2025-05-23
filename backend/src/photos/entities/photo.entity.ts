import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;
  @Column()
  url: string;
  @Column()
  caption: string;
  @Column()
  createdAt: Date;
}

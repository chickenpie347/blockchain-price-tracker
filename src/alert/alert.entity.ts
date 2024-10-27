import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chain: string;  // 'ethereum' or 'polygon'

  @Column('decimal')
  dollar: number;  // Target price for the alert

  @Column()
  email: string;  // Email address to send the alert

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}

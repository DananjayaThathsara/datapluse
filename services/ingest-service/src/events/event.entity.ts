import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('events')
export class Event {
  // Primary key as a UUID
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Event type
  @Index()
  @Column()
  type: string;

  // Event severity (e.g., 'low' | 'medium' | 'high' | 'critical')
  @Index()
  @Column()
  severity: string;

  // Optional location field (e.g., Sheikh Zayed Road, Dubai)
  @Column({ nullable: true })
  location: string;

  // Event message
  @Column('text')
  message: string;

  // Source of the event (e.g., 'traffic_sensor', 'user_report')
  @Index()
  @Column()
  source: string;

  // Additional metadata for the event
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  // Timestamp of when the event was created
  @CreateDateColumn()
  createdAt: Date;
}

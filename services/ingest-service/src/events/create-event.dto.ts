import {
  IsString,
  IsEnum,
  IsOptional,
  IsObject,
  MinLength,
} from 'class-validator';

// Define an enum for event severity levels
export enum EventSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export class CreateEventDto {
  // @IsString() — must be a string
  @IsString()
  @MinLength(2)
  type: string;

  // @IsEnum(EventSeverity) — must be one of the defined severity levels
  @IsEnum(EventSeverity)
  severity: EventSeverity;

  // @IsOptional() — this field is optional
  @IsOptional()
  @IsString()
  location?: string;

  @IsString()
  @MinLength(5)
  message: string;

  @IsString()
  source: string;

  @IsOptional()
  @IsObject() // if provided, must be a JSON object like { key: value }
  metadata?: Record<string, any>;
}

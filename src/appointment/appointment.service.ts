import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Appointment,
  AppointmentDocument,
} from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentService {
  private timeSlots = [
    { startTime: '9:00', endTime: '10:30', isAvailable: true },
    { startTime: '10:30', endTime: '12:00', isAvailable: true },
    { startTime: '12:00', endTime: '13:30', isAvailable: false },
    { startTime: '13:30', endTime: '15:00', isAvailable: true },
    { startTime: '15:00', endTime: '16:30', isAvailable: true },
    { startTime: '16:30', endTime: '18:00', isAvailable: true },
    { startTime: '18:00', endTime: '19:30', isAvailable: false },
    { startTime: '19:30', endTime: '21:00', isAvailable: true },
    { startTime: '21:00', endTime: '22:30', isAvailable: true },
  ];

  constructor(
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const isAvailable = await this.checkSlotAvailability(
      createAppointmentDto.appointmentDate,
      createAppointmentDto.startTime,
    );

    if (!isAvailable) {
      throw new BadRequestException('Selected time slot is not available');
    }

    const appointment = new this.appointmentModel(createAppointmentDto);
    return appointment.save();
  }

  async getAvailableSlots(date: string): Promise<any[]> {
    const dayAppointments = await this.appointmentModel.find({
      appointmentDate: new Date(date),
      status: { $ne: 'cancelled' },
    });

    return this.timeSlots.map((slot) => ({
      ...slot,
      isAvailable: !dayAppointments.some(
        (appointment) => appointment.startTime === slot.startTime,
      ),
    }));
  }

  private async checkSlotAvailability(
    date: Date,
    startTime: string,
  ): Promise<boolean> {
    const existingAppointment = await this.appointmentModel.findOne({
      appointmentDate: date,
      startTime,
      status: { $ne: 'cancelled' },
    });

    return !existingAppointment;
  }
}

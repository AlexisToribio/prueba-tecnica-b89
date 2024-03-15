import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllUser() {
    return await this.userRepository.find();
  }

  async getUserById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }

  async createUser(createUserDto: CreateUserDto) {
    // const { email } = createUserDto;
    // const existUser = await this.getUserByEmail(email);
    // // if (existUser) {
    // //   throw new HttpException(
    // //     'User email already exists',
    // //     HttpStatus.BAD_REQUEST,
    // //   );
    // // }

    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException();
    }

    Object.assign(user, updateUserDto);

    return await this.userRepository.save(user);
  }

  async removeUser(id: number) {
    const user = await this.getUserById(id);
    if (!user) {
      throw new NotFoundException();
    }

    return await this.userRepository.remove(user);
  }
}

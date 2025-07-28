import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user-dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './user.model';

@ApiTags('Пользователи')
@Controller('users') // базовый путь для всех методов контроллера
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Некорректные данные для регистрации',
  })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  // @ApiOperation({ summary: 'Создание пользователя' })
  // @ApiResponse({ status: 200, description: 'Пользователь создан' })
  // @Post()
  // create(@Body() dto: CreateUserDto) {
  //   return this.usersService.createUser(dto);
  // }

  @ApiOperation({ summary: 'Получение всех пользователей' })
  @ApiResponse({ status: 200, type: [User], description: 'Все пользователи' })
  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }
}

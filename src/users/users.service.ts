import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user-dto';
import { RolesService } from '../roles/roles.service';
import { Role } from '../roles/roles.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepo: typeof User,
    private rolesService: RolesService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const role = await this.rolesService.getRoleByValue('USER');
    if (!role) {
      throw new Error('Роль USER не найдена');
    }

    const candidate = await User.findOne({
      where: { email: dto.email },
    });

    if (candidate) {
      console.log('Пользователь с таким email уже существует:', dto.email);
      throw new Error('Пользователь с таким email уже существует');
    }

    const user = await this.userRepo.create(dto);

    const userPlain = user.get({ plain: true });

    await user.$set('roles', role.id);
    user.roles = [role];
    const userWithRoles = await this.userRepo.findByPk(user.id, {
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] },
          attributes: ['id', 'value', 'description'],
        },
      ],
    });

    if (!userWithRoles) {
      throw new Error('Ошибка при создании пользователя');
    }

    // Получаем чистый объект с ролями
    const result = userWithRoles.get({ plain: true });

    console.log('✅✅✅ Пользователь успешно создан:', {
      id: result.id,
      email: result.email,
      roles: result.roles || [],
    });

    return result;
  }

  async getAllUsers() {
    const users = await this.userRepo.findAll({
      include: { all: true },
    });
    return users;
  }

  async getUserByEmail(email: string) {
    console.log('🔍 Поиск пользователя по email:', email);

    const user = await this.userRepo.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] }, // Убираем лишние поля из связи
          attributes: ['id', 'value', 'description'],
        },
      ],
    });

    if (!user) {
      console.log('❌ Пользователь не найден');
      return null;
    }

    // Преобразуем в простой объект
    const userPlain = user.get({ plain: true });

    console.log('✅ Найден пользователь:', {
      id: userPlain.id,
      email: userPlain.email,
      roles: userPlain.roles || [],
    });

    return userPlain;
  }
}

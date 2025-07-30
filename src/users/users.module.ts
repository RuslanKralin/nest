import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { Role } from 'src/roles/roles.model';
import { UserRoles } from 'src/roles/user-roles.model';
import { RolesModule } from 'src/roles/roles.module';
import { AuthModule } from 'src/auth/auth.module';
import { Posts } from 'src/posts/posts.model';

@Module({
  controllers: [UsersController], // контроллеры
  providers: [UsersService], // сервисы
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles, Posts]),
    RolesModule,
    forwardRef(() => AuthModule),
  ], // модели
  exports: [UsersService],
})
export class UsersModule {}

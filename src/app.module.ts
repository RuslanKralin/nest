import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/user.model';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.model';
import { UserRoles } from './roles/user-roles.model';
import { AuthModule } from './auth/auth.module';
import { PostsController } from './posts/posts.controller';
import { PostsModule } from './posts/posts.module';
import { Posts } from './posts/posts.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [User, Role, UserRoles, Posts], // автоматически загружает все модели в папке models
      autoLoadModels: true, // автоматически загружает все модели в папке models
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    PostsModule,
  ],
  controllers: [PostsController],
  providers: [], // тут то что содержит какую то логику и используется в компонентах
  exports: [], // то что мы хотим использовать в других компонентах
})
export class AppModule {}

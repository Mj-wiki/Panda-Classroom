import { CardModule } from './modules/card/card.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { OSSModule } from './modules/oss/oss.module';
import { AuthModule } from './modules/auth/auth.module';
import { StudentModule } from './modules/student/student.module';
import { CourseModule } from './modules/course/course.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'blackstone',
      database: 'water-drop',
      entities: [`${__dirname}/../modules/**/*.entity{.ts,.js}`],
      logging: true,
      synchronize: true,
      autoLoadEntities: true,
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: './schema.gql',
    }),
    UserModule,
    OSSModule,
    AuthModule,
    StudentModule,
    OrganizationModule,
    CourseModule,
    CardModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

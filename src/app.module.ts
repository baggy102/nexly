import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './user/auth/auth.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/nexly'),
    UserModule,
    AuthModule,
    CompanyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

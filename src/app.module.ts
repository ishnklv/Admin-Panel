import { Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { AccountModule } from "./account/account.module";
import { EmailModule } from "./email/email.module";
import { TokenModule } from "./token/token.module";
import { RoleModule } from "./role/role.module";

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://aktan:root1234@cluster0.8f980.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'),
    AccountModule,
    EmailModule,
    TokenModule,
    RoleModule
  ]
})
export class AppModule {}

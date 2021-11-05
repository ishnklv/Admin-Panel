import { Module } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleController } from "./role.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Role, RoleSchema } from "./schemas/role.schema";
import { UserRole, UserRoleSchema } from "./schemas/user-role.schema";
import { UserRoleService } from "./user-role.service";
import { User, UserSchema } from "../account/schemas/user.schema";
import { TokenService } from "../token/token.service";
import { Token, TokenSchema } from "../token/schemas/token.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Role.name, schema: RoleSchema},
      {name: UserRole.name, schema: UserRoleSchema},
      {name: User.name, schema: UserSchema}
    ]),
    MongooseModule.forFeature([{name: Token.name, schema: TokenSchema}]),
  ],
  providers: [RoleService, UserRoleService, TokenService],
  controllers: [RoleController]
})
export class RoleModule {}
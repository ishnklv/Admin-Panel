import { ObjectId } from "mongoose";

export class CreateUserRoleDto {
  readonly user_id: ObjectId;
  readonly role_id: ObjectId;
}
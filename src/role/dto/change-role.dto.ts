import { ObjectId } from "mongoose";

export class ChangeRoleDto {
  readonly user_id: ObjectId;
  readonly oldRole: string;
  readonly newRole: string;
}
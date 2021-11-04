import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose'
import { Document, ObjectId } from "mongoose";
import { User } from "../../account/schemas/user.schema";
import { Role } from "./role.schema";

export type UserRoleDocument = UserRole & Document

@Schema()
export class UserRole {
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  user_id: User;


  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Role'})
  role_id: Role;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole)
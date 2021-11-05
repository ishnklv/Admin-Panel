import { InjectModel } from "@nestjs/mongoose";
import { UserRole, UserRoleDocument } from "./schemas/user-role.schema";
import { Model, ObjectId } from "mongoose";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserRoleDto } from "./dto/create-user-role.dto";
import { User, UserDocument } from "../account/schemas/user.schema";
import { Role, RoleDocument } from "./schemas/role.schema";
import { ChangeRoleDto } from "./dto/change-role.dto";
import { TokenService } from "../token/token.service";

@Injectable()
export class UserRoleService {
  constructor(@InjectModel(UserRole.name) private userRoleModel: Model<UserRoleDocument>,
              @InjectModel(User.name) private userModel: Model<UserDocument>,
              @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
              private readonly tokenService: TokenService) {}
  async create(dto: CreateUserRoleDto) {
    if(!dto) {
      throw new HttpException('Invalid data', HttpStatus.BAD_REQUEST)
    }
    const findUser = await this.userModel.findById(dto.user_id)
    const findRole = await this.roleModel.findById(dto.role_id)
    if(findUser && findRole) {
      const data = await this.userRoleModel.create(dto)
      return data
    }
    throw new HttpException('Invalid user_id or role_id', HttpStatus.BAD_REQUEST)
  }
  async getAll() {
    const data = await this.userRoleModel.find()
    return data
  }
  async changeRole(dto: ChangeRoleDto, authorization) {
      const token = authorization.split(' ')[1]
      const tokenData = await this.tokenService.findToken(token)
      if(!tokenData) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED)
      }
      const userRoleData = await this.userRoleModel.findOne({user_id: tokenData})
      if(!userRoleData) {
        throw new HttpException('Invalid role', HttpStatus.UNAUTHORIZED)
      }
      const roleData = await this.roleModel.findById(userRoleData.role_id)
      if(roleData.value != 'admin') {
        throw new HttpException('Access is Denied', HttpStatus.BAD_REQUEST)
      }
      const findUser = await this.userModel.findById(dto.user_id)
      if(!findUser) {
        throw new HttpException('Invalid user id', HttpStatus.BAD_REQUEST)
      }
      const findRole = await this.roleModel.findOne({value: dto.oldRole})
      
      if(!findRole) {
        throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST)
      }
      const findUserRoleId = await this.userRoleModel.findOne({user_id: findUser._id, role_id: findRole._id})

      if(!findUserRoleId) {
        throw new HttpException('Invalid User Role Id', HttpStatus.UNAUTHORIZED)
      }
      const newRole = {
        user_id: findUserRoleId.user_id,
        role_id: findUserRoleId.role_id
      }

      const changeUserRole = await this.userRoleModel.findByIdAndUpdate(findUserRoleId, newRole)
      return changeUserRole
  }
}
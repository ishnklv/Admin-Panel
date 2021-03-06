import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateAccountDto } from "./dto/create-account.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt'
import { EmailService } from "../email/email.service";
import * as uuid from 'uuid'
import { LoginAccountDto } from "./dto/login-account.dto";
import { UserDto } from "./dto/user.dto";
import { TokenService } from "../token/token.service";
import { ProfileDto } from "./dto/profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { Role, RoleDocument } from "../role/schemas/role.schema";
import { UserRole, UserRoleDocument } from "../role/schemas/user-role.schema";
import { PORT } from "../main";

@Injectable()
export class AccountService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
              private emailService: EmailService,
              private tokenService: TokenService,
              @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
              @InjectModel(UserRole.name) private userRoleModel: Model<UserRoleDocument>) {
  }
  async registration(dto: CreateAccountDto): Promise<User> {
    const findUser = await this.userModel.findOne({email: dto.email})
    if(findUser) {
      throw new HttpException('User with such mail already exists', HttpStatus.BAD_REQUEST)
    }
    const hashPassword = bcrypt.hashSync(dto.password, 3)
    const activationLink = uuid.v4();
    const newUser = await this.userModel.create({...dto, password: hashPassword, isActivated: false, activationLink})
    const findRole = await this.roleModel.findOne({value: 'client'})
    if(!findRole) {
      throw new HttpException('Not found Role', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    const createRole = await this.userRoleModel.create({user_id: newUser._id, role_id: findRole._id})
    await this.emailService.sendActivation(dto.email, activationLink)
    return newUser
  }
  async activate(link) {
    const findUser = await this.userModel.findOne({link})
    if(!findUser) {
      throw new HttpException('User Not Found', HttpStatus.UNAUTHORIZED)
    }
    findUser.isActivated = true
    await findUser.save()
    return link
  }
  async login(dto: LoginAccountDto) {
    if(dto.password !== dto.password2) {
      throw new HttpException('Password mismatch', HttpStatus.BAD_REQUEST)
    }
    const findUser = await this.userModel.findOne({email: dto.email})
    if(!findUser) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
    }
    const isPassEquals = bcrypt.compareSync(dto.password, findUser.password)
    if(!isPassEquals) {
      throw new HttpException('Invalid Password', HttpStatus.BAD_REQUEST)
    }
    const userDto = new UserDto(findUser)
    const tokens = this.tokenService.generateTokens({...userDto})
    await this.tokenService.saveToken(userDto.id, tokens.refreshToken)
    return {
      ...tokens,
      user: userDto
    }
  }
  async profile(headers) {
    const {authorization} = headers
    const token = authorization.split(' ')[1]
    const bearer = authorization.split(' ')[0]
    if(bearer == '' || bearer != 'Bearer') {
      throw new HttpException('Invalid Bearer Token', HttpStatus.BAD_REQUEST)
    }
    const findUserId = await this.tokenService.findToken(token)
    const findUser = await this.userModel.findById(findUserId)
    if(!findUser) {
      throw new HttpException('Invalid user id', HttpStatus.UNAUTHORIZED)
    }
    const profileDto = new ProfileDto(findUser)
    return profileDto
  }
  async resetPassword(dto: ResetPasswordDto) {
    const {email} = dto
    const findUser = await this.userModel.findOne({email})
    if(!findUser) {
      throw new HttpException('Invalid Email', HttpStatus.BAD_REQUEST)
    }
    const link = `http://localhost:${PORT}/account/reset-password/${findUser.activationLink}`
    await this.emailService.resetPassword(email, link)
  }
  async changePassword(dto: ChangePasswordDto, link) {
    if(dto.password !== dto.password2) {
      throw new HttpException('Password mismatch', HttpStatus.BAD_REQUEST)
    }
    const findUser = await this.userModel.findOne({activationLink: link})
    if(!findUser) {
      throw new HttpException('Invalid link', HttpStatus.BAD_REQUEST)
    }
    const hashPassword = bcrypt.hashSync(dto.password, 3)
    findUser.password = hashPassword
    await findUser.save()
    return new HttpException('Password successfully changed', HttpStatus.OK)
  }
  async logout() {

  }
}
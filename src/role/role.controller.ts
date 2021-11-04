import { Body, Controller, Get, Param, Post, Put, Query } from "@nestjs/common";
import { RoleService } from "./role.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UserRoleService } from "./user-role.service";
import { CreateUserRoleDto } from "./dto/create-user-role.dto";
import { ObjectId } from "mongoose";
import { ChangeRoleDto } from "./dto/change-role.dto";

@Controller('/role')
export class RoleController {
  constructor(private roleService: RoleService, private userRoleService: UserRoleService) {}
  @Post()
  createRole(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto)
  }
  @Get()
  getAllRole() {
    return this.roleService.getAllRole()
  }
  @Get('/:value')
  getByValue(@Param('value') value: string) {
    return this.roleService.getRoleByValue(value)
  }
  @Post('/user-role')
  createUserRole(@Body() dto: CreateUserRoleDto) {
    return this.userRoleService.create(dto)
  }
  @Get('/user-role')
  getAllUserRole() {
    return this.userRoleService.getAll()
  }
  @Put('/user-role')
  changeRole(@Body() dto: ChangeRoleDto) {
    return this.userRoleService.changeRole(dto)
  }
}
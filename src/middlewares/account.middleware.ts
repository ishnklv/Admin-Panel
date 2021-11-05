import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";
import { TokenService } from "../token/token.service";

@Injectable()
export class RequestAccountMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {
  }
  use(req: Request, res: Response, next: Function): any {
    console.log(`Method: [${req.method}] | ${req.path}`)
    const authorization = req.headers.authorization
    const token = authorization.split(' ')[1]
    const tokenData = this.tokenService.findToken(token)
    if(!tokenData) {
      throw new HttpException('Invalid Token', HttpStatus.UNAUTHORIZED)
    }
    next()
  }
}
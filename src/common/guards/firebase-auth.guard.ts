import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { FirebaseService } from "@/configs/firebase/firebase.service";
import { Reflector } from "@nestjs/core";
import { SKIP_AUTH_KEY } from "../decorators/skip-auth.decorator";

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Firebase 인증 생략
    const skipAuth = this.reflector.get<boolean>(
      SKIP_AUTH_KEY,
      context.getHandler(),
    );
    if (skipAuth) {
      return true;
    }

    const idToken = this.extractToken(request.headers["authorization"]);

    // Firebase 토큰 검증
    const decodedToken = await this.verifyToken(idToken);
    request.user = decodedToken;
    console.log("인증 성공");

    return true; // 인증 성공
  }

  private extractToken(authHeader: string): string {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
    return authHeader.split("Bearer ")[1];
  }

  private async verifyToken(idToken: string) {
    try {
      const decodedToken =
        await this.firebaseService.admin.verifyIdToken(idToken);
      console.log(decodedToken);

      console.log("디코딩 성공");

      return decodedToken;
    } catch (error) {
      console.error("Firebase ID token verification failed:", error);
      throw new HttpException(
        "Unauthorized: Invalid or expired ID token",
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
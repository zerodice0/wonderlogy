import { app } from "../index";
import type { RegisterResponse, LoginResponse } from "../types/auth";

describe("Auth API Tests", () => {
  describe("POST /auth/register", () => {
    it("유효한 회원가입 요청 시 성공 응답을 반환한다", async () => {
      const testUser = {
        id: `testuser_${Date.now()}`,
        password: "testpass123",
        confirmPassword: "testpass123",
      };

      const response = await app.request("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testUser),
      });

      expect(response.status).toBe(201);
      
      const data = await response.json() as RegisterResponse;
      expect(data.success).toBe(true);
      expect(data.message).toBe("회원가입이 완료되었습니다.");
      expect(data.user?.id).toBe(testUser.id);
    });

    it("아이디가 없으면 400 에러를 반환한다", async () => {
      const invalidUser = {
        password: "testpass123",
      };

      const response = await app.request("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidUser),
      });

      expect(response.status).toBe(400);
      
      const data = await response.json() as RegisterResponse;
      expect(data.success).toBe(false);
      expect(data.message).toBe("아이디와 비밀번호를 입력해주세요.");
    });

    it("비밀번호가 없으면 400 에러를 반환한다", async () => {
      const invalidUser = {
        id: "testuser",
      };

      const response = await app.request("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidUser),
      });

      expect(response.status).toBe(400);
      
      const data = await response.json() as RegisterResponse;
      expect(data.success).toBe(false);
      expect(data.message).toBe("아이디와 비밀번호를 입력해주세요.");
    });

    it("짧은 아이디(3자 미만)로 요청하면 400 에러를 반환한다", async () => {
      const invalidUser = {
        id: "te",
        password: "testpass123",
      };

      const response = await app.request("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidUser),
      });

      expect(response.status).toBe(400);
      
      const data = await response.json() as RegisterResponse;
      expect(data.success).toBe(false);
      expect(data.message).toBe("아이디는 3자 이상이어야 합니다.");
    });

    it("짧은 비밀번호(6자 미만)로 요청하면 400 에러를 반환한다", async () => {
      const invalidUser = {
        id: "testuser",
        password: "123",
      };

      const response = await app.request("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidUser),
      });

      expect(response.status).toBe(400);
      
      const data = await response.json() as RegisterResponse;
      expect(data.success).toBe(false);
      expect(data.message).toBe("비밀번호는 6자 이상이어야 합니다.");
    });

    it("비밀번호 확인이 일치하지 않으면 400 에러를 반환한다", async () => {
      const invalidUser = {
        id: "testuser",
        password: "testpass123",
        confirmPassword: "differentpass",
      };

      const response = await app.request("/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidUser),
      });

      expect(response.status).toBe(400);
      
      const data = await response.json() as RegisterResponse;
      expect(data.success).toBe(false);
      expect(data.message).toBe("비밀번호가 일치하지 않습니다.");
    });
  });

  describe("POST /auth/login", () => {
    it("아이디가 없으면 400 에러를 반환한다", async () => {
      const invalidLogin = {
        password: "testpass123",
      };

      const response = await app.request("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidLogin),
      });

      expect(response.status).toBe(400);
      
      const data = await response.json() as LoginResponse;
      expect(data.success).toBe(false);
      expect(data.message).toBe("아이디와 비밀번호를 입력해주세요.");
    });

    it("비밀번호가 없으면 400 에러를 반환한다", async () => {
      const invalidLogin = {
        id: "testuser",
      };

      const response = await app.request("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invalidLogin),
      });

      expect(response.status).toBe(400);
      
      const data = await response.json() as LoginResponse;
      expect(data.success).toBe(false);
      expect(data.message).toBe("아이디와 비밀번호를 입력해주세요.");
    });

    it("존재하지 않는 사용자로 로그인하면 401 에러를 반환한다", async () => {
      const nonExistentUser = {
        id: "nonexistentuser",
        password: "testpass123",
      };

      const response = await app.request("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nonExistentUser),
      });

      expect(response.status).toBe(401);
      
      const data = await response.json() as LoginResponse;
      expect(data.success).toBe(false);
      expect(data.message).toBe("존재하지 않는 사용자입니다.");
    });
  });
});
import { Hono } from "hono";
import bcrypt from "bcryptjs";
import { pool } from "../database";
import { generateToken } from "../utils/jwt";
import type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from "../types/auth";

const auth = new Hono();

auth.post("/login", async (c) => {
  try {
    const body = await c.req.json() as LoginRequest;
    const { email, password } = body;

    console.log(email, password);

    if (!email || !password) {
      const response: LoginResponse = {
        success: false,
        message: "이메일과 비밀번호를 입력해주세요.",
      };
      return c.json(response, 400);
    }

    const client = await pool.connect();
    
    try {
      const query = "SELECT id, email, password, name FROM users WHERE email = $1";
      const result = await client.query(query, [email]);

      if (result.rows.length === 0) {
        const response: LoginResponse = {
          success: false,
          message: "존재하지 않는 사용자입니다.",
        };
        return c.json(response, 401);
      }

      const user: User = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        const response: LoginResponse = {
          success: false,
          message: "비밀번호가 올바르지 않습니다.",
        };
        return c.json(response, 401);
      }

      const token = generateToken(user.id);

      const response: LoginResponse = {
        success: true,
        message: "로그인 성공",
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };

      return c.json(response, 200);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("로그인 에러:", error);
    
    const response: LoginResponse = {
      success: false,
      message: "서버 오류가 발생했습니다.",
    };
    
    return c.json(response, 500);
  }
});

auth.post("/register", async (c) => {
  try {
    const body = await c.req.json() as RegisterRequest;
    const { email, password, name, confirmPassword } = body;

    if (!email || !password) {
      const response: RegisterResponse = {
        success: false,
        message: "이메일과 비밀번호를 입력해주세요.",
      };
      return c.json(response, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const response: RegisterResponse = {
        success: false,
        message: "올바른 이메일 형식을 입력해주세요.",
      };
      return c.json(response, 400);
    }

    if (password.length < 6) {
      const response: RegisterResponse = {
        success: false,
        message: "비밀번호는 6자 이상이어야 합니다.",
      };
      return c.json(response, 400);
    }

    if (confirmPassword && password !== confirmPassword) {
      const response: RegisterResponse = {
        success: false,
        message: "비밀번호가 일치하지 않습니다.",
      };
      return c.json(response, 400);
    }

    const client = await pool.connect();
    
    try {
      const checkQuery = "SELECT id FROM users WHERE email = $1";
      const existingUser = await client.query(checkQuery, [email]);

      if (existingUser.rows.length > 0) {
        const response: RegisterResponse = {
          success: false,
          message: "이미 존재하는 이메일입니다.",
        };
        return c.json(response, 409);
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const insertQuery = `
        INSERT INTO users (email, password, name, created_at, updated_at) 
        VALUES ($1, $2, $3, NOW(), NOW()) 
        RETURNING id, email, name
      `;
      const result = await client.query(insertQuery, [email, hashedPassword, name]);

      const newUser = result.rows[0];

      const response: RegisterResponse = {
        success: true,
        message: "회원가입이 완료되었습니다.",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      };

      return c.json(response, 201);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("회원가입 에러:", error);
    
    const response: RegisterResponse = {
      success: false,
      message: "서버 오류가 발생했습니다.",
    };
    
    return c.json(response, 500);
  }
});

export { auth };
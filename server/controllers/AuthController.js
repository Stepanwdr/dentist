import HttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import {
  Users,
  RefreshTokens,
} from '../models/index.js';
import validate from '../services/validate.js';
import { OAuth2Client } from "google-auth-library";

const { JWT_SECRET, JWT_REFRESH_SECRET, GOOGLE_CLIENT_ID } = process.env;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Конфиг токенов
const ACCESS_TOKEN_EXPIRES = '15m';
const REFRESH_TOKEN_EXPIRES = '7d';
const REFRESH_TOKEN_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000;

class AuthController {

  static generateTokens(userId) {
    const accessToken = jwt.sign(
      { userId, type: 'access' },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );

    const refreshToken = jwt.sign(
      { userId, type: 'refresh' },
      JWT_REFRESH_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRES }
    );

    return { accessToken, refreshToken };
  }

  static async saveRefreshToken(userId, refreshToken) {
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRES_MS);

    // Удаляем старые токены пользователя (одна сессия = один refresh)
    await RefreshTokens.destroy({ where: { userId } });

    await RefreshTokens.create({
      userId,
      token: refreshToken,
      expiresAt,
    });
  }

  static async register(req, res, next) {
    try {
      const {
        lname, fname, email, password,
        address, phone, birthDate, role, speciality, gender,
      } = req.body;

      validate(req.body, {
        lname: 'required|alpha|between:2,14',
        fname: 'required|alpha|between:2,14',
        email: 'required|email',
        password: 'required|string|between:2,16',
        phone: ['required', 'string'],
      }).throw();

      const existUser = await Users.findOne({
        where: {
          $or: [{ email }, { phone }],
        },
      });

      if (existUser) {
        const errors = {};
        if (existUser.email === email) errors.email = ['Email must be unique'];
        if (existUser.phone === phone) errors.phone = ['Phone must be unique'];
        throw HttpError(422, { errors });
      }

      const user = await Users.create({
        name: `${fname} ${lname}`,
        lname,
        fname,
        email,
        password,
        address,
        phone,
        birthDate,
        role,
        speciality,
        gender,
      });

      const { accessToken, refreshToken } = AuthController.generateTokens(user.id);
      await AuthController.saveRefreshToken(user.id, refreshToken);

      res.json({
        status: 'ok',
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email, role: user.role },
      });
    } catch (e) {
      next(e);
    }
  }

  static async registerDentist(req, res, next) {
    try {
      const {
        clinicId, name, lname, fname,
        email, password, address, phone, birthDate, role, speciality, gender,
      } = req.body;

      validate(req.body, {
        name: 'required|alpha|between:2,14',
        lname: 'required|alpha|between:2,14',
        fname: 'required|alpha|between:2,14',
        email: 'required|email',
        password: 'required|string|between:2,16',
        address: 'required|string',
        phone: ['required', 'regex:/^\\(?[+]?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{3})$/'],
        birthDate: 'required|date',
        clinicId: 'required|integer',
      }).throw();

      const existUser = await Users.findOne({
        where: { $or: [{ email }, { phone }] },
      });

      if (existUser) {
        const errors = {};
        if (existUser.email === email) errors.email = ['Email must be unique'];
        if (existUser.phone === phone) errors.phone = ['Phone must be unique'];
        throw HttpError(422, { errors });
      }

      const user = await Users.create({
        clinicId,
        name,
        lname,
        fname,
        email,
        password,
        address,
        phone,
        birthDate,
        role,
        speciality,
        gender,
      });

      const { accessToken, refreshToken } = AuthController.generateTokens(user.id);
      await AuthController.saveRefreshToken(user.id, refreshToken);

      res.json({
        status: 'ok',
        accessToken,
        refreshToken,
        user: { id: user.id, email: user.email, role: user.role },
      });
    } catch (e) {
      next(e);
    }
  }

  static async login(req, res, next) {
    try {
      validate(req.body, {
        email: 'required|email',
        password: 'required:string|between:2,16',
      }).throw();

      const { email, password } = req.body;
      const user = await Users.findOne({ where: { email } });

      if (!user || user.getDataValue('password') !== Users.passwordHash(password)) {
        throw HttpError(422, 'Such user does not exist');
      }

      const { accessToken, refreshToken } = AuthController.generateTokens(user.id);
      await AuthController.saveRefreshToken(user.id, refreshToken);

      res.json({
        status: 'ok',
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
      });
    } catch (e) {
      next(e);
    }
  }

  static async loginWithGoogle(req, res, next) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        throw HttpError(422, { errors: { idToken: ['idToken is required'] } });
      }

      let payload;
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken,
          audience: GOOGLE_CLIENT_ID,
        });
        payload = ticket.getPayload();
      } catch {
        throw HttpError(401, 'Invalid Google token');
      }

      const {
        sub: googleId,
        email,
        name,
        given_name,
        family_name,
        picture,
      } = payload;

      if (!email) {
        throw HttpError(422, { errors: { email: ['Google account has no email'] } });
      }

      let user = await Users.findOne({
        where: { $or: [{ email }, { googleId }] },
      });

      if (!user) {
        user = await Users.create({
          googleId,
          email,
          name: name ?? email.split('@')[0],
          fname: given_name ?? '',
          lname: family_name ?? '',
          avatar: picture ?? null,
          role: 'patient',
          password: null,
        });
      } else {
        if (!user.googleId) {
          await user.update({ googleId, avatar: picture ?? user.avatar });
        }
      }

      const { accessToken, refreshToken } = AuthController.generateTokens(user.id);
      await AuthController.saveRefreshToken(user.id, refreshToken);

      res.json({
        status: 'ok',
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
      });
    } catch (e) {
      next(e);
    }
  }

  static async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw HttpError(422, { errors: { refreshToken: ['Refresh token is required'] } });
      }

      const tokenRecord = await RefreshToken.findOne({
        where: { token: refreshToken },
      });

      if (!tokenRecord) {
        throw HttpError(401, 'Invalid refresh token');
      }

      if (new Date() > tokenRecord.expiresAt) {
        await tokenRecord.destroy();
        throw HttpError(401, 'Refresh token expired');
      }

      let decoded;
      try {
        decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      } catch {
        await tokenRecord.destroy();
        throw HttpError(401, 'Invalid refresh token');
      }

      if (decoded.type !== 'refresh') {
        throw HttpError(401, 'Invalid token type');
      }

      const tokens = AuthController.generateTokens(decoded.userId);

      await tokenRecord.destroy();
      await AuthController.saveRefreshToken(decoded.userId, tokens.refreshToken);

      res.json({
        status: 'ok',
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } catch (e) {
      next(e);
    }
  }

  static async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        await RefreshToken.destroy({ where: { token: refreshToken } });
      }

      res.json({
        status: 'ok',
        message: 'Logged out successfully',
      });
    } catch (e) {
      next(e);
    }
  }
}

export default AuthController;
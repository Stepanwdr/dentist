import HttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import {
  Users,
} from '../models/index.js';
import validate from '../services/validate.js';
import {OAuth2Client} from "google-auth-library";

const { JWT_SECRET, GOOGLE_CLIENT_ID } = process.env;
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

class AuthController {
  static register = async (req, res, next) => {
    try {
      const {
        name, lname, fname,
        email, password, address, phone, birthDate, role, speciality, gender,
      } = req.body;
      console.log(req.body)
      validate(req.body, {
        name: 'required|alpha|between:2,14',
        // lname: 'required|alpha|between:2,14',
        // fname: 'required|alpha|between:2,14',
        email: 'required|email',
        password: 'required|string|between:2,16',
        // address: ['required', 'string'],
        // phone: ['required', 'regex:/^\\(?[+]?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/'],
        phone: ['required', 'string'],
        // birthDate: 'required|date',
      }).throw();
      const existUser = await Users.findOne({
        where: {
          $or: [
            { email },
            { phone },
          ],
        },
      });
      if (existUser) {
        const errors = {};
        if (existUser.email === email) {
          errors.email = ['Email must be unique'];
        }
        if (existUser.phone === phone) {
          errors.phone = ['Phone must be unique'];
        }
        throw HttpError(422, { errors });
      }
      const user = await Users.create({
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
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      res.json({
        status: 'ok',
        token,
      });
    } catch (e) {
      next(e);
    }
  }

  static registerDentist = async (req, res, next) => {
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
        where: {
          $or: [
            { email },
            { phone },
          ],
        },
      });
      if (existUser) {
        const errors = {};
        if (existUser.email === email) {
          errors.email = ['Email must be unique'];
        }
        if (existUser.phone === phone) {
          errors.phone = ['Phone must be unique'];
        }
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
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      res.json({
        status: 'ok',
        token,
      });
    } catch (e) {
      next(e);
    }
  }

  static login = async (req, res, next) => {
    try {
      validate(req.body, {
        email: 'required|email',
        password: 'required:string|between:2,16',
      }).throw();
      const { email, password } = req.body;
      const user = await Users.findOne({
        where: { email },
      });
      if (!user || user.getDataValue('password') !== Users.passwordHash(password)) {
        throw HttpError(422, 'Such user does not exist');
      }
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      res.json({
        status: 'ok',
        user,
        token,
      });
    } catch (e) {
      next(e);
    }
  }
  static loginWithGoogle = async (req, res, next) => {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        throw HttpError(422, { errors: { idToken: ['idToken is required'] } });
      }

      // 1. Верифицируем Google idToken
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
        sub: googleId,   // уникальный Google ID
        email,
        name,            // полное имя "Ivan Petrov"
        given_name,      // fname
        family_name,     // lname
        picture,
      } = payload;

      if (!email) {
        throw HttpError(422, { errors: { email: ['Google account has no email'] } });
      }

      // 2. Ищем существующего пользователя по email или googleId
      let user = await Users.findOne({
        where: {
          $or: [
            { email },
            { googleId },
          ],
        },
      });

      // 3. Если нет — создаём (регистрация через Google)
      if (!user) {
        user = await Users.create({
          googleId,
          email,
          name:  name        ?? email.split('@')[0],
          fname: given_name  ?? '',
          lname: family_name ?? '',
          avatar: picture    ?? null,
          role: 'patient',
          // password не нужен — вход только через Google
          password: null,
        });
      } else {
        // 4. Если нашли по email — привязываем googleId если его ещё нет
        if (!user.googleId) {
          await user.update({ googleId, avatar: picture ?? user.avatar });
        }
      }

      // 5. Выдаём свой JWT — тот же формат что и в login
      const token = jwt.sign({ userId: user.id }, JWT_SECRET);

      res.json({
        status: 'ok',
        user,
        token,
      });
    } catch (e) {
      next(e);
    }
  }
}
export default AuthController;
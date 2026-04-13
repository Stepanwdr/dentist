import jwt from 'jsonwebtoken';
import HttpError from 'http-errors';
import * as url from 'url';

const { JWT_SECRET } = process.env;

const EXCLUDE = [
  'POST:/auth/login',
  'POST:/auth/register',
  'POST:/auth/google',
  'POST:/auth/register-doctor',
  'POST:/clinic/clinic-register',
  'POST:/users/appointment',
  'POST:/users/push-token',
  'POST:/users/toothchart',
  'POST:/users/add-review',
  'GET:/users/dentist-list',
  'GET:/users/user-list',
  'GET:/users/clinic-users-list',
  'GET:/clinic/clinics',
  'GET:/users/user-list-by-dentist',
  'GET:/users/all-user-list',
  'GET:/clinic/price-list',
  'GET:/users/user-history',
  'GET:/clinic/clinic-rating',
  'GET:/users/dentist-rating',
  'GET:/clinic/single-clinic',
  'GET:/users/dentist-review',
  'GET:/users/expired-appointments',
  'GET:/users/user-rating',
  'GET:/users/all-images',
  'GET:/users/account',
  'GET:/users/single-user',
  'PUT:/users/appointment-change',
  'PUT:/users/users-update',
  'PUT:/clinic/clinic-update',
  'PUT:/users/user-payment',
  'PUT:/users/dentist-voting',
  'PUT:/clinic/clinic-voting',
  'DELETE:/users/delete-user',
  'DELETE/clinic/clinic-delete',
];

export default function (req, res, next) {
  try {
    const { originalUrl, method } = req;
    // if (method === 'OPTIONS') {
    //   next();
    //   return;
    // }
    const { pathname } = url.parse(req.url);
    const exclude = EXCLUDE.some((exc) => {
      if (exc.includes('*')) {
        return `${method}:${pathname}`.startsWith(exc.replace('*', ''));
      }
      return exc === `${method}:${pathname}`;
    });
    if (exclude) {
      next();
      return;
    }
    const { authorization = '' } = req.headers;
    const token = authorization.replace(/^Bearer /, '');
    let userId;
    try {
      const data = jwt.verify(token, JWT_SECRET);
      userId = data.userId;
    } catch (e) {

      //
    }
    if (!userId) {
      throw HttpError(401);
    }
    req.userId = userId;
    next();
  } catch (e) {
    next(e);
  }
}
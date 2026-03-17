import HttpError from 'http-errors';
import fs from 'fs';
import _ from 'lodash';
import sharp from 'sharp';

import {
  Clinic,
} from '../models/index.js';

import validate from '../services/validate.js';

class ClinicController {
  static clinicRegister = async (req, res, next) => {
    try {
      validate(req.body, {
        name: 'required|string|between:2,10',
        address: 'required|string|between:2,30',
        phone: ['required', 'regex:/^\\(?[+]?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/'],
        email: 'required|email',
        description: 'required|string',
      }).throw();

      await validate(req.file, {
        mimeType: 'in:image/png|image/jpeg',
      });
      const {
        name, address, phone, email, description, image,
      } = req.body;
      console.log(req.body);
      const existClinic = await Clinic.findOne({
        where: {
          $or: [
            { email },
            { phone },
          ],
        },
      });
      if (existClinic) {
        const errors = {};
        if (existClinic.email === email) {
          errors.email = ['Email must be unique'];
        }
        if (existClinic.phone === phone) {
          errors.phone = ['Phone must be unique'];
        }
        throw HttpError(422, { errors });
      }
      const clinic = await Clinic.create({
        name,
        address,
        phone,
        email,
        description,
        image,
      });
      if (_.isEmpty(image)) {
        clinic.image = clinic.id;
        await clinic.save();
      }

      if (!_.isEmpty(req.file)) {
        const image = req.file;
        const fileTypes = {
          'image/jpeg': '.jpg',
          'image/png': '.png',
          'image/gif': '.gif',
        };
        const imageDir = `public/images/users/${clinic.id}/`;
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
        }
        const images = `${image.fieldname}-${Date.now()}${fileTypes[image.mimetype]}`;
        // const imageFileName = `${global.serverUrl}/images/users/${clinic.id}/${images}`;
        await sharp(image.buffer)
          .resize(300, 300, {
            fit: 'contain',
            background: {
              r: 255,
              g: 255,
              b: 255,
            },
          })
          .toFile(imageDir + images);
        clinic.image = `/images/users/${clinic.id}/${images}`;
        await clinic.save();
      }
      res.json({
        status: 'ok',
        clinic,
      });
    } catch (e) {
      next(e);
    }
  };

  static getAllImages = async (req, res, next) => {
    try {
      const { clinicId } = req.body;
      const clinic = await Clinic.findOne({
        attributes: ['image'],
        where: {
          id: clinicId,
        },
      });
      console.log(clinic.image);
      res.json({
        status: 'ok',
        clinic,
      });
    } catch (e) {
      next(e);
    }
  }

  static updateClinic = async (req, res, next) => {
    try {
      const { id } = req.body;
      const {
        name, title, aboutText, ourTeamText, lat, long, gallery,
      } = req.body;

      const clinic = await Clinic.findByPk(id);

      clinic.name = name;
      clinic.title = title;
      clinic.aboutText = aboutText;
      clinic.ourTeamText = ourTeamText;
      clinic.lat = lat;
      clinic.long = long;
      clinic.gallery = gallery;

      await clinic.save();
      if (_.isEmpty(clinic.gallery)) {
        clinic.clinic.gallery = clinic.id;
        await clinic.save();
      }

      if (!_.isEmpty(req.file)) {
        const image = req.file;
        const fileTypes = {
          'image/jpeg': '.jpg',
          'image/png': '.png',
          'image/gif': '.gif',
        };
        const imageDir = `public/images/users/${clinic.id}/`;
        if (!fs.existsSync(imageDir)) {
          fs.mkdirSync(imageDir, { recursive: true });
        }
        const images = `${image.fieldname}-${Date.now()}${fileTypes[image.mimetype]}`;
        // const imageFileName = `${global.serverUrl}/images/users/${clinic.id}/${images}`;
        await sharp(image.buffer)
          .resize(300, 300, {
            fit: 'contain',
            background: {
              r: 255,
              g: 255,
              b: 255,
            },
          })
          .toFile(imageDir + images);
        clinic.image = `/images/users/${clinic.id}/${images}`;
        await clinic.save();
      }
      res.json({
        status: 'ok',
        clinic,
      });
    } catch (e) {
      next(e);
    }
  };


  static getAllClinics=async (req, res, next) => {
    try {
      res.json({
        status: 'ok',
      });
    } catch (e) {
      next(e);
    }
  };

  static getSingleClinic =async (req, res, next) => {
    try {
      const { id } = req.body;
      const singleClinic = await Clinic.findOne({
        where: { id },
      });
      res.json({
        status: 'ok',
        singleClinic,
      });
    } catch (e) {
      next(e);
    }
  };

  static clinicDelete = async (req, res, next) => {
    try {
      const { uId } = req.body;
      const deleteclinic = await Clinic.findOne({
        where: { id: uId },
      });
      await deleteclinic.destroy();

      res.json({
        status: 'ok',
        deleteclinic,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default ClinicController;
import {baseApi} from "@shared/api";

export type LoginDto = {
  email: string;
  password: string;
};

export type LoginRes = {
  token: string;
};


export const loginRequest = async (data: LoginDto):Promise<LoginRes> => {
  return await baseApi.post("users/login", data);
};
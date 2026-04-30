import { baseApi } from "@shared/api";
import { bookStatus } from "@shared/types/slot"; // твой инстанс

export const confirmBook = async (id:number) => {
  const data = await baseApi.patch(`/booking/confirm/${id}`);
  return data;
};
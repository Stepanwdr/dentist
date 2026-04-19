import { baseApi } from "@shared/api";
import { bookStatus } from "@shared/types/slot"; // твой инстанс

export const changeBookingStatus = async (id:number, status:bookStatus) => {
  const data = await baseApi.patch(`/booking/changeStatus/${id}`, { status });
  return data;
};
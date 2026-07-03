import api from "./api";
import { getErrorMessage } from "../../helpers/error";

export type StaffResponse = {
  staff_id: number;
  staff_no: string;
  first_name: string;
  last_name: string;
  nick_name: string;
  full_name: string;
  by_name: string;
  initials: string;
  nric: string;
  email: string;
  designation_name: string;
  join_date: string;
  contact_no: string;
  address1: string;
  address2: string;
  address3: string;
  full_address: string;
  error?: string;
};

export const getStaffDetails = async (): Promise<StaffResponse> => {
  try {
    const response = await api.get<StaffResponse>("/staff.php");
    return response.data;
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to fetch staff details."));
  }
};

export const updateStaffDetails = async (
  staffData: Partial<StaffResponse>
): Promise<void> => {
  try {
    await api.post("/staff.php", staffData);
  } catch (error: unknown) {
    throw new Error(getErrorMessage(error, "Failed to update staff details."));
  }
};

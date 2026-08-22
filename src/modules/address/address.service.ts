import { Address } from "./address.model.js";

interface AddressData {
  fullName?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

export const createAddress = async (userId: string, data: AddressData) => {
  // Only one default address per user — unset any existing one first
  if (data.isDefault) {
    await Address.updateMany({ userId }, { isDefault: false });
  }

  return Address.create({ userId, ...data });
};

export const getAddresses = async (userId: string) => {
  return Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 }).lean();
};

export const getAddressById = async (userId: string, addressId: string) => {
  // Scoping by userId here (not just _id) is what stops user A from
  // reading/editing user B's address just by guessing an ID
  return Address.findOne({ _id: addressId, userId }).lean();
};

export const updateAddress = async (
  userId: string,
  addressId: string,
  data: AddressData,
) => {
  if (data.isDefault) {
    await Address.updateMany({ userId }, { isDefault: false });
  }

  return Address.findOneAndUpdate({ _id: addressId, userId }, data, {
    new: true,
    runValidators: true,
  }).lean();
};

export const deleteAddress = async (userId: string, addressId: string) => {
  return Address.findOneAndDelete({ _id: addressId, userId });
};
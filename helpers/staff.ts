// Pure validation utilities for the staff profile form.

export type ProfileForm = {
  nick_name: string;
  email: string;
  contact_no: string;
  address1: string;
  address2: string;
  address3: string;
};

export type ProfileErrors = Partial<Record<keyof ProfileForm, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Keep digits only — used to filter the contact number field as it's typed.
export const sanitizeContactNo = (value: string): string =>
  value.replace(/\D/g, "");

export const validateProfileForm = (form: ProfileForm): ProfileErrors => {
  const errors: ProfileErrors = {};

  if (!form.nick_name.trim()) {
    errors.nick_name = "Nickname is required.";
  }

  const email = form.email.trim();
  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  const contact = form.contact_no.trim();
  if (!contact) {
    errors.contact_no = "Contact number is required.";
  } else if (!/^\d+$/.test(contact)) {
    errors.contact_no = "Contact number must contain digits only.";
  } else if (contact.length < 7 || contact.length > 15) {
    errors.contact_no = "Enter a valid contact number.";
  }

  if (!form.address1.trim()) {
    errors.address1 = "Address Line 1 is required.";
  }

  return errors;
};

export const isProfileFormValid = (form: ProfileForm): boolean =>
  Object.keys(validateProfileForm(form)).length === 0;

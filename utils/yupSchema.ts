import * as yup from "yup";

const regex = new RegExp(
  "(?=[A-Za-z0-9@#$%^&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$"
);

const phoneNumberRegex = new RegExp(
  "^([2-9]{1}[0-9]{2})(([2-9]{1})(1[0,2-9]{1}|[0,2-9]{1}[0-9]{1}))([0-9]{4})$"
);

export const registerValidationSchema = yup.object().shape({
  email: yup.string().email("Please enter valid email").required("Required"),
  password: yup
    .string()
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .matches(regex, "Please use suggested pattern")
    .required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required("Required"),
  name: yup
    .string()
    .min(3, ({ min }) => `Password must be at least ${min} characters`)
    .required("Required"),
});

export const editProfileValidationSchema = yup.object().shape({
  email: yup.string().email("Please enter valid email").required("Required"),
  name: yup
    .string()
    .min(3, ({ min }) => `Name must be at least ${min} characters`)
    .required("Required"),
});
export const loginValidationSchema = yup.object().shape({
  email: yup.string().email("Please enter valid email").required("Required"),
  password: yup.string().required("Required"),
});

export const forgotPasswordEmailValidationSchema = yup.object().shape({
  email: yup.string().email("Please enter valid email").required("Required"),
});

export const forgotPasswordResetSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .matches(regex, "Please use suggested pattern")
    .required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required("Required"),
});

export const postAdValidationSchema = yup.object().shape({
  title: yup
    .string()
    .min(3, ({ min }) => `Title must be at least ${min} characters`)
    .required("Required"),
  description: yup
    .string()
    .min(3, ({ min }) => `Description must be at least ${min} characters`)
    .required("Required"),
  category: yup
    .string()
    .min(3, ({ min }) => `Category must be at least ${min} characters`)
    .required("Required"),
  year: yup.date().typeError("invalid date").required("Required"),

  condition: yup.string().required("Required"),
  brand: yup.string().required("Required"),
  price: yup
    .number()
    .typeError("price must be a number")
    .positive("price must be greater than zero"),
  phone: yup
    .string()
    .matches(phoneNumberRegex, "Please enter a valid phone number"),
});

export const createNotificationSenderSchema = yup.object().shape({
  category: yup.string().required("You need to select a category!"),
  minKilometers: yup
    .number()
    .positive("Minimum kilometers should be a positive number."),
  maxKilometers: yup
    .number()
    .when("minKilometers", (minKilometers, schema) =>
      schema.min(
        minKilometers,
        "Maximum kilometers should be greater than or equal to minimum kilometers."
      )
    ),
  minYear: yup
    .number()
    .min(2000, "Minimum year should be greater than or equal to 2000."),
  maxYear: yup
    .number()
    .when("minYear", (minYear, schema) =>
      schema.min(
        minYear,
        "Maximum year should be greater than or equal to minimum year."
      )
    )
    .nullable(),
});

export const adFilterValidationSchema = yup.object().shape({
  title: yup.string(),
  description: yup.string(),
  category: yup.string(),
  minPrice: yup
    .number()
    .positive()
    .min(0, "Minimum price should be greater than or equal to 0."),
  maxPrice: yup
    .number()
    .when("minPrice", (minPrice, schema) =>
      schema.min(
        minPrice,
        "Maximum price should be greater than or equal to minimum price."
      )
    )
    .nullable(),
  minKilometers: yup
    .number()
    .min(1, "Minimum kilometer should be greater than or equal to 1."),
  maxKilometers: yup
    .number()
    .when("minKilometers", (minKilometers, schema) =>
      schema.min(
        minKilometers,
        "Maximum kilometer should be greater than or equal to minimum kilometer."
      )
    )
    .nullable(),
  location: yup.string(),
  address: yup.string(),
  phone: yup.number(),
  minDate: yup
    .number()
    .min(2000, "Minimum year should be greater than or equal to 2000."),
  maxDate: yup
    .number()
    .max(
      getCurrentYear(),
      `Maximum year should be lesser than or equal to ${getCurrentYear}.`
    )
    .when("minDate", (minDate, schema) =>
      schema.min(
        minDate,
        "Maximum year should be greater than or equal to minimum year."
      )
    )
    .nullable(),
});

function getCurrentYear() {
  return new Date().getFullYear();
}

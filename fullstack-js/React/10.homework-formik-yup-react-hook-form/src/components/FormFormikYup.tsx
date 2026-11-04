import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { type FormInputs } from "../types/interfaces";
import { safeTrim } from "../utils/helpers";
import "./Form.css";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .transform(safeTrim)
    .required("Username is required")
    .min(3, "Min length of username is 3 symbols")
    .max(15, "Max length of username is 15 symbols"),
  email: Yup.string()
    .transform(safeTrim)
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format",
    ),
  phone: Yup.string()
    .nullable()
    .notRequired()
    .transform(safeTrim)
    .matches(/^\+?[0-9\s()+-]{9,25}$/, "Invalid phone number format"),
  dateOfBirth: Yup.date()
    .nullable()
    .notRequired()
    .typeError("Invalid date of birth")
    .max(new Date(), "Date of birth cannot be in the future")
    .test("notTooOld", "Invalid date of birth", (value) => {
      if (!value) return true;
      const minYear = new Date().getFullYear() - 120;
      return value.getFullYear() >= minYear;
    }),
  password: Yup.string()
    .transform(safeTrim)
    .required("Password is required")
    .min(8, "Min length of password is 8 symbols")
    .max(20, "Max length of password is 20 symbols"),
  confirmPassword: Yup.string()
    .transform(safeTrim)
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

function FormFormikYup() {
  const initialValues: FormInputs = {
    username: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  };

  const handleSubmit = async (values: FormInputs) => {
    const normalizedValues: FormInputs = {
      username: safeTrim(values.username),
      email: safeTrim(values.email),
      phone: safeTrim(values.phone),
      dateOfBirth: safeTrim(values.dateOfBirth),
      password: safeTrim(values.password),
      confirmPassword: safeTrim(values.confirmPassword),
    };
    const cleanPhone = normalizedValues.phone?.replace(/[^0-9+]/g, "") ?? "";
    const payload = { ...normalizedValues, phone: cleanPhone };
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Success!\n" + JSON.stringify(payload));
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form noValidate>
          <label htmlFor="username">Username</label>
          <Field
            id="username"
            name="username"
            type="text"
            aria-invalid={
              touched.username && errors.username ? "true" : "false"
            }
            aria-describedby={
              touched.username && errors.username ? "username-error" : undefined
            }
          />
          <ErrorMessage name="username">
            {(msg) => (
              <p className="error" id="username-error" role="alert">
                {msg}
              </p>
            )}
          </ErrorMessage>

          <label htmlFor="email">Email</label>
          <Field
            id="email"
            name="email"
            type="email"
            aria-invalid={touched.email && errors.email ? "true" : "false"}
            aria-describedby={
              touched.email && errors.email ? "email-error" : undefined
            }
          />
          <ErrorMessage name="email">
            {(msg) => (
              <p className="error" id="email-error" role="alert">
                {msg}
              </p>
            )}
          </ErrorMessage>

          <label htmlFor="phone">Phone number</label>
          <Field
            id="phone"
            name="phone"
            type="tel"
            placeholder="+380501234567"
            aria-invalid={touched.phone && errors.phone ? "true" : "false"}
            aria-describedby={
              touched.phone && errors.phone ? "phone-error" : undefined
            }
          />
          <ErrorMessage name="phone">
            {(msg) => (
              <p className="error" id="phone-error" role="alert">
                {msg}
              </p>
            )}
          </ErrorMessage>

          <label htmlFor="dateOfBirth">Date of birth</label>
          <Field
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            aria-invalid={
              touched.dateOfBirth && errors.dateOfBirth ? "true" : "false"
            }
            aria-describedby={
              touched.dateOfBirth && errors.dateOfBirth
                ? "dateOfBirth-error"
                : undefined
            }
          />
          <ErrorMessage name="dateOfBirth">
            {(msg) => (
              <p className="error" id="dateOfBirth-error" role="alert">
                {msg}
              </p>
            )}
          </ErrorMessage>

          <label htmlFor="password">Password</label>
          <Field
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={
              touched.password && errors.password ? "true" : "false"
            }
            aria-describedby={
              touched.password && errors.password ? "password-error" : undefined
            }
          />
          <ErrorMessage name="password">
            {(msg) => (
              <p className="error" id="password-error" role="alert">
                {msg}
              </p>
            )}
          </ErrorMessage>

          <label htmlFor="confirmPassword">Confirm Password</label>
          <Field
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={
              touched.confirmPassword && errors.confirmPassword
                ? "true"
                : "false"
            }
            aria-describedby={
              touched.confirmPassword && errors.confirmPassword
                ? "confirmPassword-error"
                : undefined
            }
          />
          <ErrorMessage name="confirmPassword">
            {(msg) => (
              <p className="error" id="confirmPassword-error" role="alert">
                {msg}
              </p>
            )}
          </ErrorMessage>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default FormFormikYup;

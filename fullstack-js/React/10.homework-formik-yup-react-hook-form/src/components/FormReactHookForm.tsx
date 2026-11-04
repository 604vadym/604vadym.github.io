import { useForm } from "react-hook-form";
import { type FormInputs } from "../types/interfaces";
import { safeTrim } from "../utils/helpers";
import "./Form.css";

function FormReactHookForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({ mode: "onTouched" });

  const password = watch("password");

  const onSubmit = async (data: FormInputs) => {
    const cleanPhone = data.phone?.replace(/[^0-9+]/g, "") ?? "";
    const payload = { ...data, phone: cleanPhone };
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Success!\n" + JSON.stringify(payload));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label htmlFor="username">Username</label>
      <input
        id="username"
        type="text"
        aria-invalid={errors.username ? "true" : "false"}
        aria-describedby={errors.username ? "username-error" : undefined}
        {...register("username", {
          required: "Username is required",
          setValueAs: safeTrim,
          maxLength: {
            value: 15,
            message: "Max length of username is 15 symbols",
          },
          minLength: {
            value: 3,
            message: "Min length of username is 3 symbols",
          },
        })}
      />
      {errors.username && (
        <p className="error" id="username-error" role="alert">
          {errors.username.message}
        </p>
      )}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        aria-invalid={errors.email ? "true" : "false"}
        aria-describedby={errors.email ? "email-error" : undefined}
        {...register("email", {
          required: "Email is required",
          setValueAs: safeTrim,
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Invalid email format",
          },
        })}
      />
      {errors.email && (
        <p className="error" id="email-error" role="alert">
          {errors.email.message}
        </p>
      )}

      <label htmlFor="phone">Phone number</label>
      <input
        id="phone"
        type="tel"
        placeholder="+380501234567"
        aria-invalid={errors.phone ? "true" : "false"}
        aria-describedby={errors.phone ? "phone-error" : undefined}
        {...register("phone", {
          setValueAs: safeTrim,
          pattern: {
            value: /^\+?[0-9\s()+-]{9,25}$/,
            message: "Invalid phone number format",
          },
        })}
      />
      {errors.phone && (
        <p className="error" id="phone-error" role="alert">
          {errors.phone.message}
        </p>
      )}

      <label htmlFor="dateOfBirth">Date of birth</label>
      <input
        id="dateOfBirth"
        type="date"
        aria-invalid={errors.dateOfBirth ? "true" : "false"}
        aria-describedby={errors.dateOfBirth ? "dateOfBirth-error" : undefined}
        {...register("dateOfBirth", {
          validate: {
            notInFuture: (value) => {
              if (!value) return true;
              const selectedDate = new Date(value);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return (
                selectedDate <= today || "Date of birth cannot be in the future"
              );
            },
            notTooOld: (value) => {
              if (!value) return true;
              const selectedDate = new Date(value);
              const minYear = new Date().getFullYear() - 120;
              return (
                selectedDate.getFullYear() >= minYear || "Invalid date of birth"
              );
            },
          },
        })}
      />
      {errors.dateOfBirth && (
        <p className="error" id="dateOfBirth-error" role="alert">
          {errors.dateOfBirth.message}
        </p>
      )}

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        autoComplete="new-password"
        aria-invalid={errors.password ? "true" : "false"}
        aria-describedby={errors.password ? "password-error" : undefined}
        {...register("password", {
          required: "Password is required",
          setValueAs: safeTrim,
          maxLength: {
            value: 20,
            message: "Max length of password is 20 symbols",
          },
          minLength: {
            value: 8,
            message: "Min length of password is 8 symbols",
          },
        })}
      />
      {errors.password && (
        <p className="error" id="password-error" role="alert">
          {errors.password.message}
        </p>
      )}

      <label htmlFor="confirmPassword">Confirm Password</label>
      <input
        id="confirmPassword"
        type="password"
        autoComplete="new-password"
        aria-invalid={errors.confirmPassword ? "true" : "false"}
        aria-describedby={
          errors.confirmPassword ? "confirmPassword-error" : undefined
        }
        {...register("confirmPassword", {
          required: "Confirm password is required",
          setValueAs: safeTrim,
          validate: (value) => value === password || "Passwords must match",
        })}
      />
      {errors.confirmPassword && (
        <p className="error" id="confirmPassword-error" role="alert">
          {errors.confirmPassword.message}
        </p>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

export default FormReactHookForm;

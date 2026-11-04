import { Button, DatePicker, Form, Input } from "antd";
import { Controller, useForm } from "react-hook-form";
import dayjs, { type Dayjs } from "dayjs";
import { type FormInputs } from "../types/interfaces";
import { safeTrim } from "../utils/helpers";

function FormAntDesign() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    mode: "onTouched",
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      password: "",
      confirmPassword: "",
    },
  });
  const password = watch("password");

  const onSubmit = async (data: FormInputs) => {
    const normalizedData: FormInputs = {
      username: safeTrim(data.username),
      email: safeTrim(data.email),
      phone: safeTrim(data.phone),
      dateOfBirth: safeTrim(data.dateOfBirth),
      password: safeTrim(data.password),
      confirmPassword: safeTrim(data.confirmPassword),
    };
    const payload = {
      ...normalizedData,
      phone: normalizedData.phone.replace(/[^0-9+]/g, ""),
    };
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Success!\n" + JSON.stringify(payload, null, 2));
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit(onSubmit)}
      requiredMark={false}
    >
      <Form.Item
        label="Username"
        validateStatus={errors.username ? "error" : ""}
        help={errors.username?.message}
      >
        <Controller
          name="username"
          control={control}
          rules={{
            required: "Username is required",
            maxLength: {
              value: 15,
              message: "Max length of username is 15 symbols",
            },
            minLength: {
              value: 3,
              message: "Min length of username is 3 symbols",
            },
          }}
          render={({ field }) => (
            <Input {...field} placeholder="Enter your username" />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Email"
        validateStatus={errors.email ? "error" : ""}
        help={errors.email?.message}
      >
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email format",
            },
          }}
          render={({ field }) => (
            <Input {...field} type="email" placeholder="name@example.com" />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Phone number (optional)"
        validateStatus={errors.phone ? "error" : ""}
        help={errors.phone?.message}
      >
        <Controller
          name="phone"
          control={control}
          rules={{
            pattern: {
              value: /^\+?[0-9\s()+-]{9,25}$/,
              message: "Invalid phone number format",
            },
          }}
          render={({ field }) => (
            <Input {...field} type="tel" placeholder="+380501234567" />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Date of birth (optional)"
        validateStatus={errors.dateOfBirth ? "error" : ""}
        help={errors.dateOfBirth?.message}
      >
        <Controller
          name="dateOfBirth"
          control={control}
          rules={{
            validate: {
              notInFuture: (value) =>
                !value ||
                dayjs(value).isBefore(dayjs().add(1, "day"), "day") ||
                "Date of birth cannot be in the future",
              notTooOld: (value) =>
                !value ||
                dayjs(value).isAfter(dayjs().subtract(120, "year"), "day") ||
                "Invalid date of birth",
            },
          }}
          render={({ field }) => (
            <DatePicker
              style={{ width: "100%" }}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date: Dayjs | null) =>
                field.onChange(date ? date.format("YYYY-MM-DD") : "")
              }
              onBlur={field.onBlur}
              disabledDate={(date) => date.isAfter(dayjs(), "day")}
              format="YYYY-MM-DD"
              placeholder="Select your date of birth"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Password"
        validateStatus={errors.password ? "error" : ""}
        help={errors.password?.message}
      >
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Password is required",
            maxLength: {
              value: 20,
              message: "Max length of password is 20 symbols",
            },
            minLength: {
              value: 8,
              message: "Min length of password is 8 symbols",
            },
          }}
          render={({ field }) => (
            <Input.Password
              {...field}
              autoComplete="new-password"
              placeholder="Enter your password"
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Confirm password"
        validateStatus={errors.confirmPassword ? "error" : ""}
        help={errors.confirmPassword?.message}
      >
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: "Confirm password is required",
            validate: (value) => value === password || "Passwords must match",
          }}
          render={({ field }) => (
            <Input.Password
              {...field}
              autoComplete="new-password"
              placeholder="Confirm your password"
            />
          )}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit" block loading={isSubmitting}>
        Create account
      </Button>
    </Form>
  );
}
export default FormAntDesign;

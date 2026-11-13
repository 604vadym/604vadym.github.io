import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
    username: yup
        .string()
        .required("Username is required")
        .min(3, "3 symbols minimum"),
    email: yup
        .string()
        .required("Email is required")
        .email("Invalid email format"),
    age: yup
        .number()
        .transform((value, originalValue) =>
            originalValue === "" ? undefined : value,
        )
        .required("Age is required")
        .typeError("Age must be a number")
        .integer("Only integers allowed")
        .min(18, "Minimum age is 18 years"),
    acceptTerms: yup
        .boolean()
        .required("Accept Terms is required")
        .oneOf([true], "Accept Terms to submit"),
});

function ProfileForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
    });

    return (
        <form onSubmit={handleSubmit((data) => console.log(data))} noValidate>
            <div>
                <label>
                    Username <input {...register("username")} />
                </label>
                {errors.username && <span>{errors.username.message}</span>}
            </div>
            <div>
                <label>
                    Email <input type="email" {...register("email")} />
                </label>
                {errors.email && <span>{errors.email.message}</span>}
            </div>
            <div>
                <label>
                    Age <input type="number" {...register("age")} />
                </label>
                {errors.age && <span>{errors.age.message}</span>}
            </div>
            <div>
                <label>
                    Accept Terms{" "}
                    <input type="checkbox" {...register("acceptTerms")} />
                </label>
                {errors.acceptTerms && (
                    <span>{errors.acceptTerms.message}</span>
                )}
            </div>

            <button type="submit">Submit</button>
        </form>
    );
}

export default ProfileForm;

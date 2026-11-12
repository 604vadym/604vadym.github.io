import { useForm } from "react-hook-form";

interface RegistrationForm {
    username: string;
    password: string;
}

function RegistrationForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegistrationForm>();

    const onSubmit = (data: RegistrationForm) => console.log(data);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>
                    Username
                    <input
                        {...register("username", {
                            required: "Username is required.",
                            minLength: {
                                value: 3,
                                message: "3 symbols minimum.",
                            },
                        })}
                    />
                    {errors.username && <span>{errors.username.message}</span>}
                </label>
            </div>
            <div>
                <label>
                    Password
                    <input
                        {...register("password", {
                            required: "Password is required.",
                            minLength: {
                                value: 6,
                                message: "6 symbols minimum.",
                            },
                        })}
                        type="password"
                    />
                </label>
                {errors.password && <span>{errors.password.message}</span>}
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}

export default RegistrationForm;

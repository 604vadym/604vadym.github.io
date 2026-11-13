import { useForm, Controller } from "react-hook-form";
import CustomSelect from "./CustomSelect";

interface SubscriptionFormData {
    email: string;
    customSelect: string;
}

function SubscriptionForm() {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<SubscriptionFormData>();

    return (
        <form onSubmit={handleSubmit((data) => console.log(data))} noValidate>
            <div>
                <label>
                    Email:
                    <input
                        type="email"
                        {...register("email", { required: "Enter Email." })}
                    />
                </label>
                {errors.email && <span>{errors.email.message}</span>}
            </div>

            <div>
                <Controller
                    name="customSelect"
                    control={control}
                    rules={{ required: "Select subscription level." }}
                    render={({ field }) => <CustomSelect {...field} />}
                ></Controller>
                {errors.customSelect && (
                    <span>{errors.customSelect.message}</span>
                )}
            </div>

            <button type="submit">Submit</button>
        </form>
    );
}

export default SubscriptionForm;

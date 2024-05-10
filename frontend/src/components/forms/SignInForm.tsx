import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios, { POST_CONFIG } from "@/api/axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/UserSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function SignInForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  //   const [error, setError] = useState<string>(
  //     useSelector((state) => state.user.error)
  //   );
  const { error } = useSelector((state) => state.user);
  //   console.log(error);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    dispatch(loginUser(data)).then((response) => {
      if (response.payload) {
        navigate("/");
      }
    });
    // try {
    //   dispatch(loginUser(data));

    //   const response = await axios.post("/auth/login", data, POST_CONFIG);
    //   if (response.status === 200) {
    //     console.log("User logged successfully.");
    //     //! Redirect to confirm email page
    //     // setForm("emailConfirm");
    //   }
    //   console.log(response.data);
    // } catch (error: any) {
    //   console.log(error.response.data.message);
    //   setError(error.response.data.message);
    // }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Email</FormLabel>
              <FormControl>
                <Input
                  autoComplete="email"
                  placeholder="johndoe@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Password</FormLabel>
              <FormControl>
                <Input autoComplete="new-password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <FormDescription className=" text-red-500">{error}</FormDescription>
        )}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

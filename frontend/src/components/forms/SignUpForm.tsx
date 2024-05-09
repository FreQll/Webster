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

const FormSchema = z
  .object({
    name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirm: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export default function SignUpForm({
  setForm,
}: {
  setForm: (form: "signUp" | "emailConfirm") => void;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
    },
  });

  const [error, setError] = useState<string>("");

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    try {
      const response = await axios.post("/auth/register", data, POST_CONFIG);
      if (response.status === 200) {
        console.log("User registered successfully.");
        //! Redirect to confirm email page
        setForm("emailConfirm");
      }
      console.log(response.data);
    } catch (error: any) {
      console.log(error.response.data.message);
      setError(error.response.data.message);
    }
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input
                  autoComplete="username"
                  placeholder="John Doe"
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
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
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

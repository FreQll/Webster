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
import { Link } from "react-router-dom";

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function ResetPasswordForm({
  setForm,
}: {
  setForm: (form: "resetPassword" | "emailConfirm") => void;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  const [error, setError] = useState<string>("");

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    try {
      const response = await axios.post("/auth/reset", data, POST_CONFIG);
      if (response.status === 200) {
        console.log("Reset code sent successfully.");
        //! Redirect to confirm code page
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
        {error && (
          <FormDescription className=" text-red-500">{error}</FormDescription>
        )}
        <div className=" flex flex-row gap-2">
          <Button type="submit">Submit</Button>
          <Button type="button" onClick={() => setForm("emailConfirm")}>
            I have code already
          </Button>
        </div>
      </form>
    </Form>
  );
}

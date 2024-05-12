import ConfirmEmailForm from "@/components/forms/ConfirmEmailForm";
import SignUpForm from "@/components/forms/SignUpForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Link } from "react-router-dom";
// import { Helmet } from "react-helmet";

export default function SignUp() {
  const [form, setForm] = useState<"signUp" | "emailConfirm">("signUp");

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-14 w-auto"
          src="./favicon.svg"
          alt="Your Company"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create a new account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          {form === "signUp" ? (
            <SignUpForm setForm={setForm} />
          ) : (
            <ConfirmEmailForm setForm={setForm} />
          )}
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

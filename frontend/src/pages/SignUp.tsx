import ConfirmEmailForm from "@/components/forms/ConfirmEmailForm";
import SignUpForm from "@/components/forms/SignUpForm";
import { useState } from "react";
// import { Helmet } from "react-helmet";

export default function Auth() {
  const [form, setForm] = useState<"signUp" | "emailConfirm">("signUp");

  return (
    <div>
      <h1>Auth</h1>
      {form === "signUp" ? (
        <SignUpForm setForm={setForm} />
      ) : (
        <ConfirmEmailForm setForm={setForm} />
      )}
    </div>
  );
}

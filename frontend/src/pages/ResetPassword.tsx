import ConfirmResetPasswordForm from "@/components/forms/ConfirmResetPasswordForm";
import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import { useState } from "react";

export default function ResetPassword() {
  const [form, setForm] = useState<"resetPassword" | "emailConfirm">(
    "resetPassword"
  );

  return (
    <div>
      <h1>ResetPassword</h1>
      {form === "resetPassword" ? (
        <ResetPasswordForm setForm={setForm} />
      ) : (
        <ConfirmResetPasswordForm setForm={setForm} />
      )}
    </div>
  );
}

// export default function SignUp() {
//     const [form, setForm] = useState<"signUp" | "emailConfirm">("signUp");

//     return (
//       <div>
//         <h1>SignUp</h1>
//         {form === "signUp" ? (
//           <SignUpForm setForm={setForm} />
//         ) : (
//           <ConfirmEmailForm setForm={setForm} />
//         )}
//       </div>
//     );
//   }

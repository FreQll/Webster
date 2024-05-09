import SignUpForm from "@/components/forms/SignUpForm";
import { Helmet } from "react-helmet";

export default function Auth() {
  return (
    <div>
      <Helmet>
        <title>Sign Up | WhiteCanvas</title>
      </Helmet>
      <h1>Auth</h1>
      <SignUpForm />
    </div>
  );
}

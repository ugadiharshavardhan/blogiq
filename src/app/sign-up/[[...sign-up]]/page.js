import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <SignUp
        appearance={{
          baseTheme: dark,
        }}
        fallbackRedirectUrl="/home"
      />
    </div>
  );
}

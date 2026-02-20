import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <SignIn
        appearance={{
          baseTheme: dark,
        }}
        fallbackRedirectUrl="/home"
      />
    </div>
  );
}

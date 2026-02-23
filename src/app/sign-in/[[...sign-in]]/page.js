import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black transition-colors duration-300">
      <SignIn
        fallbackRedirectUrl="/home"
      />
    </div>
  );
}

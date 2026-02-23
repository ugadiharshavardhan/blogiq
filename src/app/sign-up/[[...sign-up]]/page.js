import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black transition-colors duration-300">
      <SignUp
        fallbackRedirectUrl="/home"
      />
    </div>
  );
}

import { SignIn } from "@clerk/nextjs";

export default async function SignInPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const redirectUrl = resolvedSearchParams?.redirect_url || "/home";

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black transition-colors duration-300">
      <SignIn
        fallbackRedirectUrl="/home"
        forceRedirectUrl={redirectUrl !== "/home" ? redirectUrl : undefined}
      />
    </div>
  );
}

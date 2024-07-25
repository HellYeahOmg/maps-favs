import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";

export const Navbar = () => {
  return (
    <header
      className={"container mx-auto flex items-center justify-between p-4"}
    >
      <div>
        <h1 className={"text-2xl"}>Custom reviews</h1>
      </div>

      <SignedOut>
        <SignInButton>
          <Button>Sign in</Button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
};

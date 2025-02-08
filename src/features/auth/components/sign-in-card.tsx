import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "../../../components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { SignInFlow } from "../types";
import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const { signIn } = useAuthActions();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleProviderSignIn = (value: "github" | "google") => {
    console.log("Signing in with:", value);
    signIn(value);
  };

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="flex items-start justify-between px-0 pt-0">
        <CardTitle className="text-2xl">Login to continue</CardTitle>
        <CardDescription>Use Your email or another service</CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 px-0 py-0">
        <form className="space-y-2.5">
          <Input
            disabled={false}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          ></Input>
          <Input
            disabled={false}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
            type="password"
            required
          ></Input>
          <Button className="w-full" size="lg" type="submit">
            Submit
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2">
          <Button
            disabled={false}
            onClick={() => handleProviderSignIn("google")}
            variant="outline"
            className="w-full relative"
          >
            <FcGoogle className="size-5 absolute top-2.5 left-2.5" />
            Continue With Google
          </Button>
          <Button
            disabled={false}
            onClick={() => handleProviderSignIn("github")}
            variant="outline"
            className="w-full relative"
          >
            <FaGithub className="size-5 absolute top-2.5 left-2.5" />
            Continue With GitHub
          </Button>
        </div>
        <p>
          Don't have an account?{" "}
          <span
            onClick={() => {
              setState("signUp");
            }}
            className="text-sky-800 hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

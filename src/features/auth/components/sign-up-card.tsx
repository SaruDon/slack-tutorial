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

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPasswordMatching, setIsPasswordMatching] = useState(true);

  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="flex items-start justify-between px-0 pt-0">
        <CardTitle className="text-2xl">Sign up to continue</CardTitle>
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
              setIsPasswordMatching(false);
            }}
            placeholder="Password"
            type="password"
            required
          ></Input>
          <Input
            disabled={false}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setIsPasswordMatching(e.target.value === password);
            }}
            placeholder="ConfirmPassword"
            type="password"
            required
          ></Input>
          {isPasswordMatching ? (
            <p></p>
          ) : (
            <p className="text-red-500 text-sm">Password do not match</p>
          )}
          <Button className="w-full" size="lg" type="submit">
            Submit
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2">
          <Button
            disabled={false}
            onClick={() => {}}
            variant="outline"
            className="w-full relative"
          >
            <FcGoogle className="size-5 absolute top-2.5 left-2.5" />
            Continue With Google
          </Button>
          <Button
            disabled={false}
            onClick={() => {}}
            variant="outline"
            className="w-full relative"
          >
            <FaGithub className="size-5 absolute top-2.5 left-2.5" />
            Continue With GitHub
          </Button>
        </div>
        <p>
          Already have an account?{" "}
          <span
            onClick={() => {
              setState("signIn");
            }}
            className="text-sky-800 hover:underline cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

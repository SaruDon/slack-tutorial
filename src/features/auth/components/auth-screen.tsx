"use client";
import { SignInFlow } from "../types";
import { useState } from "react";
import { SignInCard } from "./sign-in-card";
import { useEffect } from "react";
import { SignUpCard } from "./sign-up-card";

//This is now react compo not react server compo i.e we can run useState and useEffect inside it

export const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");

  return (
    <div className="h-screen flex items-center justify-center bg-[#5C3B58]">
      <div className="md:h-auto md:w-[420px]">
        {state === "signIn" ? (
          <SignInCard setState={setState} />
        ) : (
          <SignUpCard setState={setState} />
        )}
      </div>
    </div>
  );
};

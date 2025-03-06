"use client";

import { SignInFlow } from "../types";
import { useState } from "react";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";

//This is now react compo not react server compo i.e we can run useState and useEffect inside it

export const AuthScreen = () => {
  const [state, setState] = useState<SignInFlow>("signIn");

  return (
    <div className="min-h-screen max-h-screen flex items-center justify-center overflow-hidden bg-[#5C3B58]">
      <div className="w-[90%] max-w-[420px] max-h-[90vh] overflow-auto">
        {state === "signIn" ? (
          <SignInCard setState={setState} />
        ) : (
          <SignUpCard setState={setState} />
        )}
      </div>
    </div>
  );
};

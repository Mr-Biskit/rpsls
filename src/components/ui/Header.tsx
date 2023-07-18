import React from "react";
import { Connect } from "./Connect";
import { ModeToggle } from "../Toggle";

export const Header = () => {
  return (
    <header className="flex justify-between items-center py-5 px-10 ">
      <ModeToggle />
      <Connect />
    </header>
  );
};

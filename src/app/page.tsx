"use client";
import { useAccount, useConnect, useEnsName } from "wagmi";
import { Welcome } from "@/components/Welcome";
import { ChallengeForm } from "@/components/ChallengeForm";
import { Dashboard } from "@/components/Dashboard";

function page() {
  const { connector, isConnected, address } = useAccount();

  return (
    <main className="py-8">
      {!isConnected && <Welcome />}
      {isConnected && (
        <div className="flex justify-evenly">
          <ChallengeForm />
          <Dashboard />
        </div>
      )}
    </main>
  );
}

export default page;

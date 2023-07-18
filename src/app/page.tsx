"use client";
import { useAccount, useConnect, useEnsName } from "wagmi";
import { Welcome } from "@/components/Welcome";
import { ChallengeForm } from "@/components/ChallengeForm";
import { Dashboard } from "@/components/Dashboard";

function Page() {
  const { isConnected } = useAccount();

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

export default Page;

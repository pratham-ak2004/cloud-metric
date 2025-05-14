import { Info } from "lucide-react";
import Link from "next/link";
import React from "react";
import SignUpForm from "~/components/forms/signUpForm";
import { Button } from "~/components/ui/button";

export default function SignUpPage() {
  return (
    <main className="max-w-md mx-auto px-4 py-20">
      <div className="text-center mb-8">
        <h2 className="text-3xl mb-2">Create an Account</h2>
        <p className="text-muted-foreground">
          Join <span className="text-play">Cloud Metric</span> to start tracking
          metrices
        </p>
      </div>

      <div className="bg-secondary border border-primary-foreground p-6 rounded-lg">
        <SignUpForm />
        <div className="text-center text-sm mt-4">
          <span className="text-muted-foreground">
            Already have an account?
          </span>
          <Link href="/login" className="text-primary underline ml-1">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}

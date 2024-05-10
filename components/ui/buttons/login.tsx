// components/LoginButton.tsx

import { useSession, signIn, signOut } from "next-auth/react";
import React from "react";

const LoginButton: React.FC = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user?.name}</p>
        <button onClick={() => signOut()}>Sign Out</button>
      </div>
    );
  } else {
    return (
      <div>
        <button onClick={() => signIn("github")}>Sign in with GitHub</button>
      </div>
    );
  }
};

export default LoginButton;

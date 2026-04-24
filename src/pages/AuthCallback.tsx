import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login?error=confirmation_failed", { replace: true });
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="h-7 w-7 mx-auto rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm text-foreground/60">Confirming your account…</p>
      </div>
    </div>
  );
};

export default AuthCallback;

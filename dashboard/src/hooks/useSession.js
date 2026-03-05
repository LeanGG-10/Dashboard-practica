import { useEffect, useState } from "react";
import { authService } from "../services/authService";

export function useSession() {
  const [session, setSession] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;

    authService
      .getSession()
      .then(({ data: { session } }) => {
        if (!mounted) return;
        setSession(session);
      })
      .finally(() => {
        if (!mounted) return;
        setInitializing(false);
      });

    const {
      data: { subscription },
    } = authService.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setSession(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, initializing };
}


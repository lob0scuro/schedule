import { useState, useEffect, useContext, createContext } from "react";

const Provider = createContext();

export const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrateUser = async () => {
      try {
        const response = await fetch("/api/auth/hydrate");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error when fetching user: ", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    hydrateUser();
  }, []);

  return (
    <Provider.Provider value={{ user, loading }}>{children}</Provider.Provider>
  );
};

export const useAuth = () => useContext(Provider);

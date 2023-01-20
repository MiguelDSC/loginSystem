import { createContext, PropsWithChildren, useState } from "react";

type AuthType = {
  username: string;
  password: string;
  accessToken: string;
};

type AuthValue = {
  auth: AuthType;
  setAuth: (newValue: AuthType) => void;
};

const AuthContext = createContext<AuthValue | null>(null);

export const AuthProvider = (props: PropsWithChildren) => {
  const [auth, setAuth] = useState<AuthType>({
    username: "",
    password: "",
    accessToken: "",
  });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

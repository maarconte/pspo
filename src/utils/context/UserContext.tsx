// User context based on the user's authentication status

import { FC, ReactNode, createContext, useState } from "react";

import { auth } from "../../firebase";

interface UserContextProps {
  children: ReactNode;
}

interface UserContextValue {
  user: any;
  setUser: any;
}

export const UserContext = createContext<UserContextValue>({
  user: null,
  setUser: () => {},
});

const UserContextProvider: FC<UserContextProps> = ({ children }) => {
  const [user, setUser] = useState(auth.currentUser);

  auth.onAuthStateChanged((user) => {
    setUser(user);
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;

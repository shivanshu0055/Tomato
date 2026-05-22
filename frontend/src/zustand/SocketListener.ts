import {useAppContext} from "./AppContext";
import { useSocketContext } from "./SocketContext";

interface AppState {
  isAuth: boolean;
  token?: string;
}

interface SocketState {
  connectSocket: (token: string) => void;
  disconnectSocket: () => void;
}

let initialized = false;

export const initializeSocketListener = () => {
  if (initialized) return;

  initialized = true;

  useAppContext.subscribe((state) => {
    const { isAuth, token } = state;

    const { connectSocket, disconnectSocket } =
      useSocketContext.getState();

    if (isAuth && token) {
      connectSocket(token);
    } else {
      disconnectSocket();
    }
  });
};
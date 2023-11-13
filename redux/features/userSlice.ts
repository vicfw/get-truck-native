import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string;
  email: string;
  name: string;
  photo: string;
  role: string;
  notificationToken: string | undefined;
}
interface CounterState {
  isSignedIn: boolean;
  token: string;
  user: UserState;
}
const initialState: CounterState = {
  isSignedIn: false,
  token: "",
  user: {
    id: "",
    email: "",
    name: "",
    photo: "",
    role: "",
    notificationToken: "",
  },
};
export const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    handleSignIn: (state, action: PayloadAction<boolean>) => {
      state.isSignedIn = action.payload;
    },
    handleAddToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    handleAddNotificationToken: (state, action: PayloadAction<string>) => {
      state.user.notificationToken = action.payload;
    },
    handleAddUser: (state, action: PayloadAction<UserState>) => {
      state.user = action.payload;
    },
  },
});
export const {
  handleSignIn,
  handleAddToken,
  handleAddUser,
  handleAddNotificationToken,
} = usersSlice.actions;
export default usersSlice.reducer;

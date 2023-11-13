import { RootState } from "../redux/store";

export const setBearerToken = (headers: Headers, getState: () => unknown) => {
  const token = (getState() as RootState).user.token;
  if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }
  return headers;
};

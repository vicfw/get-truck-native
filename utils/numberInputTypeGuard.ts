export const numberInputTypeGuard = (input: number | undefined): boolean => {
  if (typeof input === "undefined") return false;

  return true;
};

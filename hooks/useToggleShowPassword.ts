import { useState } from "react";

export const useTogglePasswordVisibility = () => {
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState<"eye-outline" | "eye-off-outline">(
    "eye-outline"
  );
  const handlePasswordVisibility = () => {
    if (rightIcon === "eye-outline") {
      setRightIcon("eye-off-outline");
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === "eye-off-outline") {
      setRightIcon("eye-outline");
      setPasswordVisibility(!passwordVisibility);
    }
  };
  return {
    passwordVisibility,
    rightIcon,
    handlePasswordVisibility,
  };
};

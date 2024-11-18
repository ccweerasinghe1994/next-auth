type TUpdatePassword = {
  token: string;
  password: string;
  confirmPassword: string;
};

export const updatePassword = async ({
  token,
  password,
  confirmPassword,
}: TUpdatePassword) => {
  return {
    error: true,
    message: "You are already logged in",
  };
};

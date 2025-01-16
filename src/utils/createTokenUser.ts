import { TokenUser } from "../../types";

export const createTokenUser = ({ email, id, name, role }: TokenUser) => {
  return { id, name, email, role };
};

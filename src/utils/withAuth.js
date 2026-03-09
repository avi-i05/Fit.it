import { requireAdmin } from "./requireAdmin";

export const withAuth = (loaderFn) => {
  return async (args) => {
    
    await requireAdmin();

    return loaderFn ? loaderFn(args) : null;
  };
};

import { useRouter } from "next/router";

export const useRedirect = (url: string) => {
  const router = useRouter();
  router.push(url);
}
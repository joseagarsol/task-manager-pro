import { useRouter, usePathname, useSearchParams } from "next/navigation";

export const useTaskNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const openTask = (taskId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("taskId", taskId);

    router.push(`${pathname}?${params.toString()}`);
  };

  const closeTask = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("taskId");

    router.push(`${pathname}?${params.toString()}`);
  };

  return { openTask, closeTask };
};

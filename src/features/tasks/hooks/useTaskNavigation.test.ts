import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTaskNavigation } from "./useTaskNavigation";

const pushMock = vi.fn();
const mockPathname = "/task-details";
const mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
}));

describe("useTaskNavigation Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Should update searchParams when calling openTask", () => {
    const { result } = renderHook(() => useTaskNavigation());

    act(() => {
      result.current.openTask("task-123");
    });

    expect(pushMock).toHaveBeenCalledWith("/task-details?taskId=task-123");
  });

  it("SHould remove taskId from searchParams when calling closeTask", () => {
    const { result } = renderHook(() => useTaskNavigation());

    act(() => {
      result.current.closeTask();
    });

    expect(pushMock).toHaveBeenCalledWith("/task-details?");
  });
});

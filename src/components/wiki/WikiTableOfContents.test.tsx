import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useSequentialHeading } from "./WikiTableOfContents";

afterEach(() => vi.useRealTimers());

describe("sequential wiki headings", () => {
  it("passes headings 2 and 3 before reaching heading 4", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ target }) => useSequentialHeading(target, "article"), { initialProps: { target: 0 } });
    rerender({ target: 3 });
    expect(result.current).toBe(0);
    act(() => vi.advanceTimersByTime(160));
    expect(result.current).toBe(1);
    act(() => vi.advanceTimersByTime(160));
    expect(result.current).toBe(2);
    act(() => vi.advanceTimersByTime(160));
    expect(result.current).toBe(3);
  });

  it("reverses sequentially when the target changes", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ target }) => useSequentialHeading(target, "article"), { initialProps: { target: 3 } });
    act(() => vi.advanceTimersByTime(160));
    act(() => vi.advanceTimersByTime(160));
    expect(result.current).toBe(2);
    rerender({ target: 0 });
    act(() => vi.advanceTimersByTime(160));
    expect(result.current).toBe(1);
    act(() => vi.advanceTimersByTime(160));
    expect(result.current).toBe(0);
  });
});
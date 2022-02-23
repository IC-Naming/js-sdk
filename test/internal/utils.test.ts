import { throwable } from "../../src/internal/utils";

describe("Internal utils", () => {
  describe("throwable", () => {
    it("should throw error", () =>
      expect(
        throwable(() =>
          Promise.resolve({ Err: { code: 0, message: "fake error" } })
        )
      ).rejects.toThrowError("IcNamingCanisterError"));

    it("should not throw error", () =>
      expect(throwable(() => Promise.resolve({ Ok: true }))).resolves.toEqual({
        Ok: true,
      }));
  });
});

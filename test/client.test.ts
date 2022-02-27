import { IcNamingClient } from "../src";

jest.mock("../src/internal/base");

describe("IcNamingClient", () => {
  it("should naming available", async () => {
    const client = new IcNamingClient({
      net: "MAINNET",
      mode: "local",
    });

    client["registrar"] = { available: () => {} } as any;

    jest
      .spyOn(client["registrar"], "available")
      .mockResolvedValue({ Ok: true });

    await expect(client.isAvailableNaming("naming")).resolves.toBeTruthy();

    expect(client["registrar"].available).toBeCalledTimes(1);
  });
});

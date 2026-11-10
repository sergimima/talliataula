import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));

import { enviarSollicitud } from "./contacte";

function form(extra: Record<string, string> = {}): FormData {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  const f = new FormData();
  const base: Record<string, string> = {
    locale: "es",
    name: "Laia",
    email: "laia@example.com",
    date: d.toISOString().slice(0, 10),
    place: "Girona",
    guests: "80",
    eventType: "casament",
    privacy: "on",
    web: "",
    ...extra,
  };
  for (const [k, v] of Object.entries(base)) f.append(k, v);
  f.append("services", "tall");
  return f;
}

describe("enviarSollicitud", () => {
  beforeEach(() => {
    send.mockReset();
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_TO_EMAIL", "joan@example.com, altre@example.com");
    vi.stubEnv("CONTACT_FROM_EMAIL", "Web <web@example.com>");
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => vi.unstubAllEnvs());

  it("envia el correu amb resposta a l'email del client", async () => {
    send.mockResolvedValue({ data: { id: "1" }, error: null });
    const r = await enviarSollicitud({ status: "idle" }, form());
    expect(r).toEqual({ status: "success" });
    expect(send).toHaveBeenCalledOnce();
    const arg = send.mock.calls[0][0];
    expect(arg.to).toEqual(["joan@example.com", "altre@example.com"]);
    expect(arg.replyTo).toBe("laia@example.com");
    expect(arg.subject).toContain("80 convidats");
    expect(arg.text).toContain("Lloc: Girona");
    expect(arg.text).toContain("Tall de pernil en directe");
  });

  it("no envia res si és spam però respon èxit", async () => {
    const r = await enviarSollicitud({ status: "idle" }, form({ web: "spam" }));
    expect(r).toEqual({ status: "success" });
    expect(send).not.toHaveBeenCalled();
  });

  it("retorna errors de camp i conserva els valors", async () => {
    const r = await enviarSollicitud({ status: "idle" }, form({ email: "malament" }));
    expect(r.status).toBe("error");
    if (r.status !== "error") return;
    expect(r.code).toBe("form");
    expect(r.errors.email).toBe("email");
    expect(r.values.name).toBe("Laia");
    expect(r.values.services).toEqual(["tall"]);
    expect(send).not.toHaveBeenCalled();
  });

  it("avisa si falta configuració", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const r = await enviarSollicitud({ status: "idle" }, form());
    expect(r.status === "error" && r.code).toBe("config");
  });

  it("avisa si Resend falla", async () => {
    send.mockResolvedValue({ data: null, error: { message: "boom" } });
    const r = await enviarSollicitud({ status: "idle" }, form());
    expect(r.status === "error" && r.code).toBe("send");
  });
});

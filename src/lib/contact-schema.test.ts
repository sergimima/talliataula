import { describe, expect, it } from "vitest";
import { parseContactForm, todayISO } from "./contact-schema";

function fd(entries: Record<string, string | string[]>): FormData {
  const f = new FormData();
  for (const [k, v] of Object.entries(entries)) {
    for (const item of Array.isArray(v) ? v : [v]) f.append(k, item);
  }
  return f;
}

const tomorrow = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
})();

const valid = {
  name: "Laia Puig",
  email: "laia@example.com",
  phone: "600 000 000",
  date: tomorrow,
  place: "Girona",
  time: "Migdia",
  guests: "120",
  eventType: "casament",
  services: ["tall", "pa-amb-tomaquet"],
  message: "Volem pernil a l'aperitiu",
  privacy: "on",
  web: "",
};

describe("parseContactForm", () => {
  it("accepta un formulari correcte i normalitza els valors", () => {
    const r = parseContactForm(fd(valid));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.data.guests).toBe(120);
    expect(r.data.services).toEqual(["tall", "pa-amb-tomaquet"]);
    expect(r.data.email).toBe("laia@example.com");
  });

  it("marca com a obligatoris nom, email, data, lloc, convidats i privacitat", () => {
    const r = parseContactForm(fd({ web: "" }));
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors.name).toBe("required");
    expect(r.errors.email).toBe("required");
    expect(r.errors.date).toBe("required");
    expect(r.errors.place).toBe("required");
    expect(r.errors.guests).toBe("required");
    expect(r.errors.privacy).toBe("privacy");
  });

  it("rebutja un email mal escrit", () => {
    const r = parseContactForm(fd({ ...valid, email: "laia@" }));
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.errors.email).toBe("email");
  });

  it("rebutja dates passades i accepta la d'avui", () => {
    const past = parseContactForm(fd({ ...valid, date: "2000-01-01" }));
    expect(past.ok).toBe(false);
    if (!past.ok) expect(past.errors.date).toBe("date");
    const today = parseContactForm(fd({ ...valid, date: todayISO() }));
    expect(today.ok).toBe(true);
  });

  it("rebutja nombres de convidats fora de rang", () => {
    for (const guests of ["0", "-3", "6000", "abc", "12.5"]) {
      const r = parseContactForm(fd({ ...valid, guests }));
      expect(r.ok, guests).toBe(false);
      if (!r.ok) expect(r.errors.guests).toBe("guests");
    }
  });

  it("ignora serveis o tipus d'esdeveniment desconeguts", () => {
    const r = parseContactForm(fd({ ...valid, services: ["tall", "hack"], eventType: "xxx" }));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.data.services).toEqual(["tall"]);
    expect(r.data.eventType).toBe("altre");
  });

  it("detecta el camp trampa dels robots", () => {
    const r = parseContactForm(fd({ ...valid, web: "http://spam.example" }));
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.spam).toBe(true);
  });

  it("limita la llargada del missatge", () => {
    const r = parseContactForm(fd({ ...valid, message: "a".repeat(3001) }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.message).toBe("tooLong");
  });
});

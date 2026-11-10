import Image from "next/image";
import Link from "next/link";

/** 404 dentro de un idioma. Bilingüe porque aquí no se recibe el parámetro de idioma. */
export default function NotFound() {
  return (
    <main className="container" style={{ textAlign: "center", padding: "90px 0" }}>
      <Image src="/il/logo-joan.webp" alt="" width={648} height={662} style={{ width: 150, height: "auto", margin: "0 auto 20px" }} />
      <h1 style={{ fontSize: "clamp(2.4rem, 6vw, 3.6rem)", marginBottom: 14 }}>Ups!</h1>
      <p className="lead">Aquesta pàgina no existeix · Esta página no existe</p>
      <p style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginTop: 26 }}>
        <Link href="/ca" className="btn btn-primary">
          Anar a l&apos;inici
        </Link>
        <Link href="/es" className="btn btn-ghost">
          Ir al inicio
        </Link>
      </p>
    </main>
  );
}

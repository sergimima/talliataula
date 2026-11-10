import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage, OwnerData } from "@/components/LegalPage";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata({ params }: PageProps<"/[lang]/avis-legal">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: `${dict.legal.noticeTitle} · Tall i a Taula`,
    alternates: { canonical: `/${lang}/avis-legal`, languages: { ca: "/ca/avis-legal", es: "/es/avis-legal" } },
  };
}

export default async function AvisLegal({ params }: PageProps<"/[lang]/avis-legal">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <LegalPage lang={lang} dict={dict} title={dict.legal.noticeTitle}>
      {lang === "ca" ? (
        <>
          <p>
            En compliment de la Llei 34/2002, de serveis de la societat de la informació i de comerç electrònic (LSSI-CE), us
            informem de les dades del titular d&apos;aquest web.
          </p>
          <OwnerData heading={dict.legal.owner} />
          <h2>Objecte</h2>
          <p>
            Aquest web dona a conèixer el servei de tall de pernil en directe per a casaments i esdeveniments i permet sol·licitar-ne
            pressupost. La sol·licitud no comporta cap compromís de contractació.
          </p>
          <h2>Propietat intel·lectual</h2>
          <p>
            Les fotografies, les il·lustracions, el logotip i els textos d&apos;aquest web són propietat del titular o s&apos;utilitzen
            amb autorització. No es poden reproduir ni distribuir sense permís.
          </p>
          <h2>Responsabilitat</h2>
          <p>
            Treballem perquè la informació del web sigui correcta i estigui actualitzada, però les condicions definitives de cada
            servei són les que consten al pressupost acceptat.
          </p>
        </>
      ) : (
        <>
          <p>
            En cumplimiento de la Ley 34/2002, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), os
            informamos de los datos del titular de esta web.
          </p>
          <OwnerData heading={dict.legal.owner} />
          <h2>Objeto</h2>
          <p>
            Esta web da a conocer el servicio de corte de jamón en directo para bodas y eventos y permite solicitar presupuesto. La
            solicitud no implica ningún compromiso de contratación.
          </p>
          <h2>Propiedad intelectual</h2>
          <p>
            Las fotografías, las ilustraciones, el logotipo y los textos de esta web son propiedad del titular o se utilizan con
            autorización. No pueden reproducirse ni distribuirse sin permiso.
          </p>
          <h2>Responsabilidad</h2>
          <p>
            Trabajamos para que la información de la web sea correcta y esté actualizada, pero las condiciones definitivas de cada
            servicio son las que constan en el presupuesto aceptado.
          </p>
        </>
      )}
    </LegalPage>
  );
}

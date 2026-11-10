import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage, OwnerData } from "@/components/LegalPage";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacitat">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: `${dict.legal.privacyTitle} · Tall i a Taula`,
    alternates: { canonical: `/${lang}/privacitat`, languages: { ca: "/ca/privacitat", es: "/es/privacitat" } },
  };
}

export default async function Privacitat({ params }: PageProps<"/[lang]/privacitat">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <LegalPage lang={lang} dict={dict} title={dict.legal.privacyTitle}>
      {lang === "ca" ? (
        <>
          <OwnerData heading={dict.legal.controller} />
          <h2>Quines dades tractem i per què</h2>
          <p>
            Quan ens envieu el formulari de pressupost tractem les dades que hi escriviu (nom, correu electrònic, telèfon, data, lloc i
            detalls de l&apos;esdeveniment) amb una única finalitat: respondre la vostra sol·licitud i preparar-vos un pressupost.
          </p>
          <h2>Base legal</h2>
          <p>
            El vostre consentiment, que doneu en marcar la casella del formulari, i l&apos;aplicació de mesures precontractuals a
            petició vostra (preparar el pressupost).
          </p>
          <h2>Quant de temps les conservem</h2>
          <p>
            El temps necessari per atendre la sol·licitud. Si no es contracta el servei, les suprimim com a màxim un any després de
            l&apos;últim contacte. Si es contracta, les conservem durant els terminis que exigeix la normativa fiscal i comercial.
          </p>
          <h2>Qui hi té accés</h2>
          <p>
            No cedim les vostres dades a tercers. Per fer funcionar el web fem servir proveïdors que actuen com a encarregats del
            tractament: el servei d&apos;allotjament del web i el servei d&apos;enviament de correus que ens fa arribar el formulari.
            Alguns d&apos;aquests proveïdors poden tractar dades fora de l&apos;Espai Econòmic Europeu amb les garanties que preveu el
            RGPD (clàusules contractuals tipus o marc de privacitat de dades UE-EUA).
          </p>
          <h2>Els vostres drets</h2>
          <p>
            Podeu demanar l&apos;accés, la rectificació, la supressió, la limitació, l&apos;oposició i la portabilitat de les vostres
            dades, i retirar el consentiment en qualsevol moment, contactant-nos pels mitjans indicats més amunt. Si considereu que no
            hem atès correctament els vostres drets, podeu presentar una reclamació a l&apos;Agència Espanyola de Protecció de Dades
            (aepd.es).
          </p>
          <h2>Galetes</h2>
          <p>Aquest web no utilitza galetes de seguiment, publicitat ni analítica.</p>
        </>
      ) : (
        <>
          <OwnerData heading={dict.legal.controller} />
          <h2>Qué datos tratamos y por qué</h2>
          <p>
            Cuando nos enviáis el formulario de presupuesto tratamos los datos que escribís (nombre, correo electrónico, teléfono,
            fecha, lugar y detalles del evento) con una única finalidad: responder vuestra solicitud y prepararos un presupuesto.
          </p>
          <h2>Base legal</h2>
          <p>
            Vuestro consentimiento, que dais al marcar la casilla del formulario, y la aplicación de medidas precontractuales a
            petición vuestra (preparar el presupuesto).
          </p>
          <h2>Cuánto tiempo los conservamos</h2>
          <p>
            El tiempo necesario para atender la solicitud. Si no se contrata el servicio, los suprimimos como máximo un año después del
            último contacto. Si se contrata, los conservamos durante los plazos que exige la normativa fiscal y mercantil.
          </p>
          <h2>Quién tiene acceso</h2>
          <p>
            No cedemos vuestros datos a terceros. Para que la web funcione utilizamos proveedores que actúan como encargados del
            tratamiento: el servicio de alojamiento de la web y el servicio de envío de correos que nos hace llegar el formulario.
            Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo con las garantías que prevé el RGPD
            (cláusulas contractuales tipo o marco de privacidad de datos UE-EE. UU.).
          </p>
          <h2>Vuestros derechos</h2>
          <p>
            Podéis solicitar el acceso, la rectificación, la supresión, la limitación, la oposición y la portabilidad de vuestros
            datos, y retirar el consentimiento en cualquier momento, contactándonos por los medios indicados más arriba. Si consideráis
            que no hemos atendido correctamente vuestros derechos, podéis presentar una reclamación ante la Agencia Española de
            Protección de Datos (aepd.es).
          </p>
          <h2>Cookies</h2>
          <p>Esta web no utiliza cookies de seguimiento, publicidad ni analítica.</p>
        </>
      )}
    </LegalPage>
  );
}

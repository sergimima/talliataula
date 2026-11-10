import { notFound } from "next/navigation";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Includes } from "@/components/Includes";
import { Quote } from "@/components/Quote";
import { Services } from "@/components/Services";
import { Steps } from "@/components/Steps";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { galleryPhotos } from "@/lib/gallery";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <a href="#contingut" className="skip-link">
        {lang === "ca" ? "Anar al contingut" : "Ir al contenido"}
      </a>
      <Header lang={lang} dict={dict.nav} />
      <main id="contingut">
        <Hero dict={dict.hero} strip={dict.strip} />
        <About dict={dict.about} />
        <Experience dict={dict.experience} />
        <Services dict={dict.services} />
        <Includes dict={dict.includes} />
        <Gallery lang={lang} dict={dict.gallery} photos={galleryPhotos} />
        <Steps dict={dict.steps} />
        <Quote lang={lang} dict={dict.quote} />
      </main>
      <Footer lang={lang} dict={dict} />
      <WhatsAppFloat label={dict.whatsappFloat} text={dict.quote.whatsappText} />
    </>
  );
}

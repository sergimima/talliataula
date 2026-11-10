import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./Quote";
import styles from "./WhatsAppFloat.module.css";

export function WhatsAppFloat({ label, text }: { label: string; text: string }) {
  return (
    <a className={styles.float} href={whatsappUrl(text)} target="_blank" rel="noopener noreferrer" aria-label={label}>
      <WhatsAppIcon />
    </a>
  );
}

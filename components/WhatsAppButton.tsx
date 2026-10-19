import { MessageCircle } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/data";

/**
 * Fixed WhatsApp action button. Uses the zip primary colour because
 * the template defines --primary-color.
 */
export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="fab fab--whatsapp"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle size={26} strokeWidth={2.2} />
      <span className="fab__tooltip" role="tooltip">
        Chat with us on WhatsApp
      </span>
    </a>
  );
}

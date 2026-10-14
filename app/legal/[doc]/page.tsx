import { notFound } from "next/navigation";

// /legal/[doc]/ · Términos, garantías y privacidad (wireframe pág. 18).
// Fase 1B: responde 404 hasta que se construya.
export default function LegalPage(): never {
  notFound();
}

import { notFound } from "next/navigation";

// /proyectos/ · Despachos en obra, condicional a 3 o más con permiso (wireframe pág. 14).
// Fase 1B: responde 404 hasta que se construya.
export default function ProyectosPage(): never {
  notFound();
}

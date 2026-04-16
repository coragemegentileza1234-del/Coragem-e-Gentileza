import { Suspense } from "react";

import { FormularioResponsabilidadeAdocao } from "@/features/adocao";

export default function AdocaoPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f8f4ec] px-6 py-10 text-slate-700">
          Carregando formulario...
        </main>
      }
    >
      <FormularioResponsabilidadeAdocao />
    </Suspense>
  );
}

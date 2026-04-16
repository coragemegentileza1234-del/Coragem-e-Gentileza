import { NextRequest, NextResponse } from "next/server";

import { updateAnimalStatus } from "@/features/animais/server/animaisRepository";
import { updateAdoptionApplicationStatus } from "@/features/adocoes/server/adocoesRepository";
import { isValidAdoptionStatus } from "@/features/adocoes/server/adocoesValidation";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const payload = (await request.json()) as { status?: string };

    if (!payload.status || !isValidAdoptionStatus(payload.status)) {
      return NextResponse.json({ error: "Status da solicitacao invalido." }, { status: 400 });
    }

    const application = await updateAdoptionApplicationStatus(id, payload.status);

    if (!application) {
      return NextResponse.json(
        { error: "Solicitacao de adocao nao encontrada." },
        { status: 404 },
      );
    }

    if (payload.status === "aprovada") {
      await updateAnimalStatus(application.animalId, "adotado");
    }

    if (payload.status === "pendente") {
      await updateAnimalStatus(application.animalId, "processo_adocao");
    }

    if (payload.status === "reprovada") {
      await updateAnimalStatus(application.animalId, "disponivel");
    }

    return NextResponse.json({ application });
  } catch {
    return NextResponse.json(
      { error: "Nao foi possivel atualizar a solicitacao." },
      { status: 500 },
    );
  }
}

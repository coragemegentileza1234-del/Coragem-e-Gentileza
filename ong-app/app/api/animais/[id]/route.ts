import { NextRequest, NextResponse } from "next/server";

import type { AnimalStatus } from "@/features/animais";
import { getAnimalById, updateAnimalStatus } from "@/features/animais/server/animaisRepository";

export const runtime = "nodejs";

const ALLOWED_STATUS: AnimalStatus[] = ["disponivel", "processo_adocao", "adotado"];

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const animal = await getAnimalById(id);

  if (!animal) {
    return NextResponse.json({ error: "Animal nao encontrado." }, { status: 404 });
  }

  return NextResponse.json({ animal });
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const payload = (await request.json()) as { status?: string };

    if (!payload.status || !ALLOWED_STATUS.includes(payload.status as AnimalStatus)) {
      return NextResponse.json({ error: "Status invalido para o animal." }, { status: 400 });
    }

    const animal = await updateAnimalStatus(id, payload.status as AnimalStatus);

    if (!animal) {
      return NextResponse.json({ error: "Animal nao encontrado." }, { status: 404 });
    }

    return NextResponse.json({ animal });
  } catch {
    return NextResponse.json(
      { error: "Nao foi possivel atualizar o status do animal." },
      { status: 500 },
    );
  }
}

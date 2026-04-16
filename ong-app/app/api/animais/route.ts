import { NextRequest, NextResponse } from "next/server";

import { createAnimal, listAnimals } from "@/features/animais/server/animaisRepository";
import { validateCreateAnimalPayload } from "@/features/animais/server/animaisValidation";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const includeNonAvailable =
    request.nextUrl.searchParams.get("includeNonAvailable") === "true";

  const animals = await listAnimals({ includeNonAvailable });
  return NextResponse.json({ animals });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const validation = validateCreateAnimalPayload(payload);

    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const animal = await createAnimal(validation.data);
    return NextResponse.json({ animal }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Nao foi possivel cadastrar o animal." },
      { status: 500 },
    );
  }
}

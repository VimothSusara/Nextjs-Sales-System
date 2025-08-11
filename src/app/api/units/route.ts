import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth";
import prisma from "@/lib/prisma";

//GET all units
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const units = await prisma.unit.findMany();
        return NextResponse.json(units);
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch units" }, { status: 500 });
    }
}

//POST new unit
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        console.log(body);

        if (!body.name) {
            return NextResponse.json({ message: "Name is required" }, { status: 400 });
        }

        if (!body.abbreviation) {
            return NextResponse.json({ message: "Abbreviation is required" }, { status: 400 });
        }

        const existingUnit = await prisma.unit.findUnique({
            where: {
                name: body.name,
            },
        });

        if (existingUnit) {
            return NextResponse.json({ message: "Unit already exists" }, { status: 400 });
        }

        const unit = await prisma.unit.create({
            data: {
                name: body.name,
                abbreviation: body.abbreviation,
            },
        });

        return NextResponse.json(unit);
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch units" }, { status: 500 });
    }
}
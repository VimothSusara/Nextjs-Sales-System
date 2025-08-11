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
        const categories = await prisma.category.findMany();
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch categories" }, { status: 500 });
    }
}

//POST new category
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

        const existingCategory = await prisma.category.findUnique({
            where: {
                name: body.name,
            },
        });

        if (existingCategory) {
            return NextResponse.json({ message: "Category already exists" }, { status: 400 });
        }

        const category = await prisma.category.create(
            {
                data: {
                    name: body.name,
                }
            }
        );
        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ message: "Failed to create category" }, { status: 500 });
    }
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth";
import prisma from "@/lib/prisma";

//GET all items
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const items = await prisma.item.findMany({
            include: {
                category: true,
                unit: true,
            }
        })

        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch items" }, { status: 500 });
    }
}

//POST new item
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        console.log(body);

        const { name, description, sku, categoryId, unitId, reorderLevel = 10, itemType, barcode } = body;

        if (!name || !description || !categoryId || !unitId || !itemType) {
            return NextResponse.json({ message: "Please fill out required fields." }, { status: 400 });
        }

        const existingItem = await prisma.item.findFirst({
            where: {
                name,
            },
        });

        if (existingItem) {
            return NextResponse.json({ message: "Item already exists" }, { status: 400 });
        }

        const item = await prisma.item.create({
            data: {
                name,
                description,
                sku,
                category: {
                    connect: {
                        id: categoryId,
                    },
                },
                unit: {
                    connect: {
                        id: unitId,
                    },
                },
                reorderLevel,
                itemType,
                barcode,
            },
        });

        return NextResponse.json(item);
    }
    catch (error) {
        return NextResponse.json({ message: "Failed to create item" }, { status: 500 });
    }
}
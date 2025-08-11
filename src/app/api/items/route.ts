import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth";
import prisma from "@/lib/prisma";

//GET all items
export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "15", 10);
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            prisma.item.findMany({
                include: {
                    category: true,
                    unit: true,
                },
                skip,
                take: limit,
            }),
            prisma.item.count(),
        ])

        return NextResponse.json({
            data: items,
            total,
            page,
            limit,
        });
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
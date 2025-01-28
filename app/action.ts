"use server"
import prisma from "@/lib/prisma"


export async function carRegistered(email: string, mark: string, carModel: string, description: string|undefined, images: string[]) {
    if (!email){ 
        throw new Error("Email manquant")
    }
    try {
        await prisma.car.create({
            data: {
                author: email,
                mark,
                modelCar: carModel,
                description,
                images: {
                    create: images.map((image) => ({ imageUrl: image.trim() }))
                }
            }
        })
    } catch (error) {
        throw new Error("carRegisteredError: "+ error)
    }
}
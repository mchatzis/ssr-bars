'use server'

import { PlaceCreationFormState } from "@/app/data/page";
import { Database } from "@/lib/db/Database";
import { PlaceOfPlaceTypeInAreaEntity } from "@/lib/db/types";
import { randomUUID } from "crypto";
import placeCreationFormSchema from "./schema";

export async function createPlace(state: PlaceCreationFormState, formData: FormData): Promise<PlaceCreationFormState> {
    const attempts = (state?.attempts ?? 0) + 1;

    try {
        const validatedData = placeCreationFormSchema.safeParse({
            name: formData.get('name'),
            area: formData.get('area'),
            placeType: formData.get('placeType'),
            category: formData.get('category'),
            longitude: Number(formData.get('longitude')),
            latitude: Number(formData.get('latitude')),
            description: formData.get('description'),
        });

        if (!validatedData.success) {
            return {
                errors: validatedData.error.flatten().fieldErrors,
                attempts,
            };
        }

        const placeData = validatedData.data;

        const uuid = randomUUID();
        const imagePrefix = `${placeData.area}/${placeData.placeType}/${placeData.name}_${uuid}`
        const place: PlaceOfPlaceTypeInAreaEntity = {
            PK: `AREA#${placeData.area}#PLACE_TYPE#${placeData.placeType}`,
            SK: `CATEGORY#${placeData.category}#PLACE#${uuid}`,
            uuid: uuid,
            name: placeData.name,
            longitude: placeData.longitude,
            latitude: placeData.latitude,
            category: placeData.category,
            area: placeData.area,
            description: placeData.description,
            primaryImage: imagePrefix + '/' + 'primaryImage.jpg',
            images: [
                'image1.jpg',
                'image2.jpg',
                'image3.jpg'
            ].map(img => imagePrefix + '/' + img),
            createdAt: Date.now(),
            updatedAt: Date.now()
        }

        console.log(place)

        const db = Database.getInstance();
        await db.put({
            Item: place
        });

    } catch (error) {
        console.log(error)
    }

    return {
        success: true
    }
}
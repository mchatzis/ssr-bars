import { z } from "zod";

export const placeCreationFormSchema = z.object({
    name: z.string().min(1, "Name is required"),
    area: z.string().min(1, "Area is required"),
    placeType: z.string().min(1, "Place type is required"),
    category: z.string().min(1, "Category is required"),
    longitude: z.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
    latitude: z.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
    description: z.string().min(1, "Description is required"),
});

export default placeCreationFormSchema;

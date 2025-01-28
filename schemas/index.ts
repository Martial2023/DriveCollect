import * as z from 'zod';

export const imageSchema = z.object({
    imageUrl: z.string().min(1, 
        { 
            message: "L'URL de l'image doit être valide."
        })
});

export const carSchema = z.object({
    email: z
        .string()
        .email({ message: "Votre Email est obligatoire et doit être valide." }),
    mark: z
        .string()
        .nonempty({ message: "Kerol veut obligatoirement la marque, SVP." }),
    carModel: z
        .string()
        .nonempty({ message: "Veuillez fournir le nom du modèle, SVP." }),
    description: z.string().optional(), // Champ optionnel
    images: z.array(imageSchema).min(1, {message: "Choisissez au moins une image"}) // Tableau d'images avec validation
});

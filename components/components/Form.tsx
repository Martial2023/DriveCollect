'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { carSchema } from '@/schemas';
import { Button } from '../ui/button';
import { Image, LoaderCircle, Trash2 } from 'lucide-react';
import { carRegistered } from '@/app/action';
import PopUp from './PopUp';

const FormCar = () => {
  const form = useForm<z.infer<typeof carSchema>>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      email: '',
      mark: '',
      carModel: '',
      description: '',
      images: [], // Initialisation des images
    },
  });

  const [isPending, setIsPending] = useState<boolean>(false);
  const [popUpOpen, setPopUpOpen] = useState(false);
  const [popUpType, setPopUpType] = useState<'Error' | 'Info'>('Info');
  const [popUpMessage, setPopUpMessage] = useState<string>('');
  const [addingImages, setAddingImages] = useState<boolean>(true);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const updatedImages = Array.from(files).map((file) => URL.createObjectURL(file));
      if (updatedImages.length + previewImages.length > 4) {
        setPopUpType('Error');
        setPopUpMessage('Choissisez au plus 4 images par soumission');
        setPopUpOpen(true);
      } else {
        setPreviewImages((prev) => [...prev, ...updatedImages]);

        // Ajouter les fichiers au formulaire
        const currentImages = form.getValues().images || [];
        form.setValue('images', [
          ...currentImages,
          ...Array.from(files).map((file) => ({ imageUrl: URL.createObjectURL(file) })),
        ]);
      }
    }
  };

  const removeImage = (index: number) => {
    const updatedPreview = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updatedPreview);

    // Mettre à jour les images dans le formulaire
    const currentImages = form.getValues().images || [];
    const updatedImages = currentImages.filter((_, i) => i !== index);
    form.setValue('images', updatedImages);
  };

  const onSubmit = async (data: z.infer<typeof carSchema>) => {
    setIsPending(true);
    try {
      // Simuler un traitement
      const uploadedImageUrls = previewImages; // Remplacez par une logique de téléversement si nécessaire

      // Réinitialisation
      form.reset();
      setPreviewImages([]);
      setPopUpType('Info');
      setPopUpMessage('Enregistrement réussi !');
      await carRegistered(data.email, data.mark, data.carModel, data.description, uploadedImageUrls);

    } catch (error) {
      setPopUpType('Error');
      setPopUpMessage(error as string);
    } finally {
      setPopUpOpen(true);
      setIsPending(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    setPreviewImages([]);
  }

  const handleMinImage = () => {
    if (previewImages.length === 0) {
      setPopUpType('Error');
      setPopUpMessage('Choisissez au moins une image');
      setPopUpOpen(true)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Champ Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="martial@gmail.com"
                  className="p-3 outline-none h-16"
                  required
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Champs Marque et Modèle */}
        <div className="flex flex-col md:flex-row items-center justify-center w-full gap-3 py-2">
          <FormField
            control={form.control}
            name="mark"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Marque</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Toyota"
                    className="p-3 outline-none h-16"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="carModel"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Modèle</FormLabel>
                <FormControl>
                  <Input
                    placeholder="LandCruiser V8"
                    className="p-3 outline-none h-16"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Décrivez le modèle"
                  className="p-3 outline-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Upload et prévisualisation des images */}
        <div>
          {
            (addingImages || previewImages.length == 0) && (
              <Button
                type='button'
                variant={"outline"}
                className=" w-full h-40 flex flex-col items-center justify-center"
                onClick={() => {
                  document.getElementById("imageInput")?.click()
                  setAddingImages(false)
                }}
              >
                <Image className="h-10 w-10 text-2xl text-primary" />
                <span>Importer des images de la voiture</span>
              </Button>
            )
          }
          <input
            id='imageInput'
            type="file"
            accept="image/*"
            multiple
            className="hidden w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
            onChange={handleImageSelection}
          />

          <div className="flex flex-wrap justify-center items-center gap-4 my-4">
            {previewImages.map((image, index) => (
              <div key={index} className="relative w-1/3">
                <img src={image} alt={`preview-${index}`} className="w-full h-32 object-cover rounded-md" />
                <button
                  type='button'
                  className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md"
                  onClick={() => removeImage(index)}
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            type='button'
            variant={"destructive"}
            className="text-xl text-white px-4 py-2 border rounded-md text-center"
            onClick={handleCancel}
          >
            Annuler
          </Button>

          <Button
            type="submit"
            className="px-6 py-3 text-white bg-primary text-xl"
            onClick={handleMinImage}
          >
            {isPending ? <LoaderCircle className="w-5 h-5 animate-spin" /> : 'Sauvegarder'}
          </Button>
        </div>
      </form>

      {/* PopUp */}
      <PopUp type={popUpType} message={popUpMessage} open={popUpOpen} onClose={() => setPopUpOpen(false)} />
    </Form>
  );
};

export default FormCar;
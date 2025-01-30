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
import { Images, LoaderCircle, Trash2 } from 'lucide-react';
import { carRegistered } from '@/app/action';
import PopUp from './PopUp';
import { generateReactHelpers } from '@uploadthing/react';
import emailjs from "@emailjs/browser";
import Image from 'next/image';


const { uploadFiles } = generateReactHelpers();

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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);


  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const selectedFiles = Array.from(files);

      if (selectedFiles.length + previewImages.length > 4) {
        // Limitation à 4 images maximum
        setPopUpType('Error');
        setPopUpMessage('Choisissez au plus 4 images par soumission.');
        setPopUpOpen(true);
      } else {
        // Prévisualisation locale des images
        const updatedPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
        setPreviewImages((prev) => [...prev, ...updatedPreviews]);
        setSelectedFiles((prev) => [...prev, ...selectedFiles]);
        //console.log("ALE")

        // Mise à jour des fichiers dans le formulaire
        const currentImages = form.getValues().images || [];
        form.setValue('images', [...currentImages, ...selectedFiles.map((file) => ({ imageUrl: URL.createObjectURL(file) })),]);
      }
    }
  };

  const removeImage = (index: number) => {
    const updatedPreview = previewImages.filter((_, i) => i !== index);
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setPreviewImages(updatedPreview);
    setSelectedFiles(updatedFiles)

    // Mettre à jour les images dans le formulaire
    const currentImages = form.getValues().images || [];
    const updatedImages = currentImages.filter((_, i) => i !== index);
    form.setValue('images', updatedImages);
  };

  const onSubmit = async (data: z.infer<typeof carSchema>) => {
    setIsPending(true);

    try {
      const uploadedImages = await uploadFiles('carImage', { files: selectedFiles });

      //Récupérer les URLs des images téléversées
      const imageUrls = uploadedImages.map((result) => result.url);
      // Étape 2 : Préparer les données finales
      const finalData = {
        ...data,
        images: imageUrls,
      };

      // Simulation d'une API ou d'un traitement avec les données finales
      await carRegistered(
        finalData.email,
        finalData.mark,
        finalData.carModel,
        finalData.description,
        finalData.images
      );
      

      // Réinitialisation du formulaire et des états
      const formDataEmail = {
        from_email: finalData.email,
        marque: finalData.mark,
        model: finalData.carModel,
        description: finalData.description || '',
        nimages: selectedFiles.length.toString(),
      };
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
        formDataEmail,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
      );
      setPopUpType('Info');
      setPopUpMessage('Enregistrement réussi !');
      form.reset();
      setPreviewImages([]);
      setSelectedFiles([])
      
      
      
    } catch (error) {
      setPopUpType('Error');
      setPopUpMessage(`Une erreur est survenue : ${error}`);
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
              <>
                <Button
                  type='button'
                  variant={"outline"}
                  className=" w-full h-40 flex flex-col items-center justify-center"
                  onClick={() => {
                    document.getElementById("imageInput")?.click()
                    setAddingImages(false)
                  }}
                >
                  <Images className="h-10 w-10 text-2xl text-primary" />
                  <span>Importer des images de la voiture</span>
                </Button>
              </>

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
                <Image
                src={image}
                alt={`preview-${index}`}
                width={20}
                height={20}
                className="w-full h-32 object-cover rounded-md" />
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
        <div className="flex justify-end gap-2 md:gap-4 mt-6">
          <Button
            type='button'
            variant={"destructive"}
            className="text-xl text-white px-4 py-2 rounded-md text-center"
            onClick={handleCancel}
          >
            Annuler
          </Button>

          <Button
            type="submit"
            className="px-6 py-3 text-white bg-primary text-xl"
            onClick={handleMinImage}
          >
            {isPending ? <LoaderCircle className="w-5 h-5 animate-spin" /> : 'Soumettre'}
          </Button>
        </div>
      </form>

      {/* PopUp */}
      <PopUp type={popUpType} message={popUpMessage} open={popUpOpen} onClose={() => setPopUpOpen(false)} />
    </Form>
  );
};

export default FormCar;
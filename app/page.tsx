import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Boxes, Info } from "lucide-react";
import Form from "@/components/components/Form";


export default function Home() {
  return (
    <main className="w-full min-h-screen flex items-center justify-center">

      <Tabs defaultValue="account" className="w-full md:w-[600px] mx-3">

        <TabsList className="w-full grid grid-cols-2 h-18">
          <TabsTrigger value="info" className="text-2xl  flex flex-col">
            <Boxes className="text-primary" />
            Collect
          </TabsTrigger>
          <TabsTrigger value="about" className="text-2xl flex flex-col">
            <Info className="text-primary" />
            A propos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card className="bg-opacity-15">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Collect</CardTitle>
              <CardDescription className="text-primary text-xl">
                Veuillez renseigner les informations de la voiture que vous avez trouvée
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Form />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card className="text-center p-8">
            Nous receuillons des données sur des models de voitures dans un but purement éducatif
          </Card>
        </TabsContent>
      </Tabs>
      
    </main>
  );
}

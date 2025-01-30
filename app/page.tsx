import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Boxes, Info } from "lucide-react";
import Form from "@/components/components/Form";


export default function Home() {
  return (
    <main className="w-full min-h-screen flex p-6 items-center justify-center relative">

      <Tabs defaultValue="account" className="w-full md:w-[600px] mx-3 z-50">

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
          {/* <Card className="bg-glass-12"> */}
          <Card className="bg-white bg-opacity-10 backdrop-blur-md shadow-md border border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Collect</CardTitle>
              <CardDescription className="text-primary text-xl text-center">
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
            Nous receuillons des données sur des models de voitures dans un but purement éducatif          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}

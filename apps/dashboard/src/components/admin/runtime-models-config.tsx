import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import RuntimeModelCard from "@/components/admin/runtime-model-card";

export default function RuntimeModelsConfig() {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Runtime models</h2>
      </div>
      <div className="flex gap-4">
        <RuntimeModelCard modelName="Gemini Flash 2.5" modelType="accurate" />
        <RuntimeModelCard modelName="GPT-OSS 120B" modelType="fast" />
        {/* <Card> */}
        {/*   <CardHeader> */}
        {/*     <CardDescription>Accurate Model</CardDescription> */}
        {/*     <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex gap-2 items-center"> */}
        {/*       <Brain /> */}
        {/*       Gemini Flash 2.5 */}
        {/*     </CardTitle> */}
        {/*     <CardAction> */}
        {/*       <Button variant="secondary">Configure</Button> */}
        {/*     </CardAction> */}
        {/*   </CardHeader> */}
        {/*   <CardFooter className="flex-col items-start gap-1.5 text-sm"> */}
        {/*     <div className="text-muted-foreground"> */}
        {/*       Fast model is used for quick, inexpensive operations like parsing text or verification. We recommend using */}
        {/*       a snappy, smaller model */}
        {/*     </div> */}
        {/*   </CardFooter> */}
        {/* </Card> */}
      </div>
    </div>
  );
}

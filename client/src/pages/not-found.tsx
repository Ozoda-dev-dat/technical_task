import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f2f5] p-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardContent className="pt-10 pb-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-[#001529] mb-2">404 - Sahifa topilmadi</h1>
          <p className="text-muted-foreground mb-8 text-sm">
            Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki boshqa manzilga ko'chirilgan.
          </p>
          <Button 
            className="bg-[#1890ff] hover:bg-[#40a9ff] w-full font-bold h-11"
            onClick={() => setLocation("/")}
          >
            Bosh sahifaga qaytish
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

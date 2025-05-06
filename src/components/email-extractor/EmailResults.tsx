
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmailGroups } from "@/types";
import { Save } from "lucide-react";

interface EmailResultsProps {
  emailGroups: EmailGroups;
}

const EmailResults: React.FC<EmailResultsProps> = ({ emailGroups }) => {
  const { personal, corporate, educational, others } = emailGroups;
  
  const totalEmails = 
    Object.values(personal).flat().length + 
    Object.values(corporate).flat().length + 
    Object.values(educational).flat().length + 
    Object.values(others).flat().length;
  
  const exportToCSV = () => {
    let csvContent = "Tipo,Dominio,Correo Electrónico\n";
    
    // Añadir correos personales
    Object.entries(personal).forEach(([domain, emails]) => {
      emails.forEach(email => {
        csvContent += `Personal,${domain},${email}\n`;
      });
    });
    
    // Añadir correos corporativos
    Object.entries(corporate).forEach(([domain, emails]) => {
      emails.forEach(email => {
        csvContent += `Corporativo,${domain},${email}\n`;
      });
    });
    
    // Añadir correos educativos
    Object.entries(educational).forEach(([domain, emails]) => {
      emails.forEach(email => {
        csvContent += `Educativo,${domain},${email}\n`;
      });
    });
    
    // Añadir otros correos
    Object.entries(others).forEach(([domain, emails]) => {
      emails.forEach(email => {
        csvContent += `Otros,${domain},${email}\n`;
      });
    });
    
    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "correos_extraidos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const exportToJSON = () => {
    const jsonData = JSON.stringify(emailGroups, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "correos_extraidos.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Componente para renderizar un grupo de correos
  const EmailGroup = ({ 
    title, 
    data, 
    badgeColor 
  }: { 
    title: string; 
    data: Record<string, string[]>; 
    badgeColor: string;
  }) => {
    const totalInGroup = Object.values(data).flat().length;
    if (totalInGroup === 0) return null;
    
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge className={badgeColor}>{totalInGroup}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {Object.entries(data).map(([domain, emails]) => (
            <div key={domain} className="mb-3 last:mb-0">
              <h4 className="text-sm font-medium mb-2">{domain} ({emails.length})</h4>
              <div className="bg-secondary p-2 rounded text-sm max-h-40 overflow-y-auto">
                {emails.map((email, index) => (
                  <div key={index} className="mb-1 last:mb-0 break-all">{email}</div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  if (totalEmails === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Resultados ({totalEmails} correos encontrados)</h2>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button onClick={exportToJSON} variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Exportar JSON
          </Button>
        </div>
      </div>
      
      <EmailGroup 
        title="Correos Personales" 
        data={personal}
        badgeColor="bg-blue-500 hover:bg-blue-600" 
      />
      
      <EmailGroup 
        title="Correos Corporativos" 
        data={corporate}
        badgeColor="bg-green-500 hover:bg-green-600" 
      />
      
      <EmailGroup 
        title="Correos Educativos" 
        data={educational}
        badgeColor="bg-amber-500 hover:bg-amber-600" 
      />
      
      <EmailGroup 
        title="Otros Correos" 
        data={others}
        badgeColor="bg-gray-500 hover:bg-gray-600" 
      />
    </div>
  );
};

export default EmailResults;

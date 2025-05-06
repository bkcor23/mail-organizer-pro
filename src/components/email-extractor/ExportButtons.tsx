
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { EmailGroups } from "@/types";
import { 
  exportToCSV, 
  exportToJSON, 
  exportToExcelByDomains, 
  exportToExcelByCategories 
} from "@/utils/emailExport";

interface ExportButtonsProps {
  emailGroups: EmailGroups;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ emailGroups }) => {
  return (
    <div className="flex gap-2">
      <Button onClick={() => exportToCSV(emailGroups)} variant="outline" size="sm">
        <Save className="mr-2 h-4 w-4" />
        Exportar CSV
      </Button>
      <Button onClick={() => exportToJSON(emailGroups)} variant="outline" size="sm">
        <Save className="mr-2 h-4 w-4" />
        Exportar JSON
      </Button>
      <Button onClick={() => exportToExcelByDomains(emailGroups)} variant="outline" size="sm">
        <Save className="mr-2 h-4 w-4" />
        Excel por Dominios
      </Button>
      <Button onClick={() => exportToExcelByCategories(emailGroups)} variant="outline" size="sm">
        <Save className="mr-2 h-4 w-4" />
        Excel por Categorías
      </Button>
    </div>
  );
};

export default ExportButtons;

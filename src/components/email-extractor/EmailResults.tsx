
import React from "react";
import { EmailGroups } from "@/types";
import EmailGroup from "./EmailGroup";
import ExportButtons from "./ExportButtons";

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
  
  if (totalEmails === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Resultados ({totalEmails} correos encontrados)</h2>
        <ExportButtons emailGroups={emailGroups} />
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

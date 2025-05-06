
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EmailGroupProps {
  title: string;
  data: Record<string, string[]>;
  badgeColor: string;
}

const EmailGroup: React.FC<EmailGroupProps> = ({ title, data, badgeColor }) => {
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

export default EmailGroup;

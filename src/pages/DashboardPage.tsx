
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUploader from "@/components/email-extractor/FileUploader";
import EmailResults from "@/components/email-extractor/EmailResults";
import { useAuth } from "@/context/AuthContext";
import { EmailGroups } from "@/types";
import { categorizeEmails } from "@/utils/emailExtractor";
import UserManagement from "@/components/admin/UserManagement";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [emailGroups, setEmailGroups] = useState<EmailGroups>({
    personal: {},
    corporate: {},
    educational: {},
    others: {}
  });
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleExtractEmails = (emails: string[]) => {
    const categorized = categorizeEmails(emails);
    setEmailGroups(categorized);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Email Extractor Pro</h1>
            <p className="text-sm text-gray-600">
              Bienvenido, {currentUser?.username} | Rol: {currentUser?.role === "admin" ? "Administrador" : "Usuario"}
            </p>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 py-8">
        <Tabs defaultValue="extractor" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="extractor">Extractor de correos</TabsTrigger>
            {isAdmin && <TabsTrigger value="admin">Administración</TabsTrigger>}
          </TabsList>
          <TabsContent value="extractor">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <FileUploader onExtractEmails={handleExtractEmails} />
              </div>
              <div className="md:col-span-2">
                <EmailResults emailGroups={emailGroups} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="admin">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;

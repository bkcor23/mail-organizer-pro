
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import RegisterForm from "@/components/auth/RegisterForm";

const UserManagement = () => {
  const { users, deleteUser, currentUser, isAdmin } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteUser = (userId: string, username: string) => {
    try {
      deleteUser(userId);
      toast({
        title: "Usuario eliminado",
        description: `El usuario "${username}" ha sido eliminado correctamente.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo eliminar el usuario.",
      });
    }
  };

  if (!isAdmin) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Acceso denegado</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No tienes permisos para acceder a esta sección.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Gestión de usuarios</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8">
              <UserPlus className="mr-2 h-4 w-4" />
              Crear usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crear nuevo usuario</DialogTitle>
            </DialogHeader>
            <RegisterForm />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="grid grid-cols-12 gap-4 p-4 font-medium">
            <div className="col-span-5">Nombre de usuario</div>
            <div className="col-span-5">Rol</div>
            <div className="col-span-2">Acciones</div>
          </div>
          {users.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-12 gap-4 border-t p-4 text-sm"
            >
              <div className="col-span-5 flex items-center">{user.username}</div>
              <div className="col-span-5 flex items-center">
                {user.role === "admin" ? (
                  <span className="rounded bg-amber-100 px-2 py-1 text-xs text-amber-800">
                    Administrador
                  </span>
                ) : (
                  <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                    Usuario
                  </span>
                )}
              </div>
              <div className="col-span-2 flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteUser(user.id, user.username)}
                  disabled={user.id === currentUser?.id}
                  className="h-8 w-8 text-destructive hover:text-destructive/90"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserManagement;


import React from "react";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Email Extractor Pro</h1>
          <p className="text-gray-600 mt-2">
            Extrae y organiza correos electrónicos de tus archivos
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;

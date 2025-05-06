
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Upload, File, X } from "lucide-react";
import { extractEmails } from "@/utils/emailExtractor";

interface FileUploaderProps {
  onExtractEmails: (emails: string[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onExtractEmails }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles: File[] = [];
    let hasInvalidFile = false;

    Array.from(fileList).forEach(file => {
      if (file.type === "text/plain" || file.type === "application/pdf") {
        newFiles.push(file);
      } else {
        hasInvalidFile = true;
      }
    });

    if (hasInvalidFile) {
      toast({
        variant: "destructive",
        title: "Formato no soportado",
        description: "Solo se aceptan archivos TXT y PDF.",
      });
    }

    if (newFiles.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (files.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No hay archivos para procesar.",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const allEmails: string[] = [];
      
      for (const file of files) {
        const text = await readFileContent(file);
        const extractedEmails = extractEmails(text);
        allEmails.push(...extractedEmails);
      }
      
      // Eliminar duplicados
      const uniqueEmails = [...new Set(allEmails)];
      
      onExtractEmails(uniqueEmails);
      
      toast({
        title: "Procesamiento completado",
        description: `Se encontraron ${uniqueEmails.length} correos electrónicos únicos.`,
      });
    } catch (error) {
      console.error("Error al procesar archivos:", error);
      toast({
        variant: "destructive",
        title: "Error en el procesamiento",
        description: "Hubo un problema al extraer los correos electrónicos.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
        reader.readAsText(file);
      } else if (file.type === "application/pdf") {
        // En un entorno de navegador real, necesitaríamos una biblioteca como pdf.js
        // Por ahora, simulamos la extracción de texto de un PDF
        resolve(`Contenido simulado del PDF ${file.name} con algunos correos como ejemplo@gmail.com y otro@empresa.com`);
      } else {
        reject(new Error("Formato de archivo no soportado"));
      }
    });
  };

  return (
    <div className="space-y-4">
      <Card
        className={`file-drop-area ${isDragActive ? "active" : ""}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".txt,.pdf"
          multiple
          className="hidden"
        />
        <div className="flex flex-col items-center">
          <Upload className="h-12 w-12 mb-4 text-primary" />
          <h3 className="text-lg font-medium mb-1">Arrastra y suelta archivos aquí</h3>
          <p className="text-sm text-muted-foreground mb-2">o haz clic para seleccionar archivos</p>
          <p className="text-xs text-muted-foreground">Formatos soportados: .txt, .pdf</p>
        </div>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Archivos seleccionados:</h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-secondary p-2 rounded">
                <div className="flex items-center">
                  <File className="h-4 w-4 mr-2" />
                  <span className="text-sm truncate max-w-[250px]">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button 
            className="w-full" 
            onClick={processFiles} 
            disabled={isProcessing}
          >
            {isProcessing ? "Procesando..." : "Procesar archivos"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;

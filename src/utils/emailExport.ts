
import * as XLSX from "xlsx";
import { EmailGroups } from "@/types";

// Función para exportar a CSV
export const exportToCSV = (emailGroups: EmailGroups) => {
  const { personal, corporate, educational, others } = emailGroups;
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
  downloadFile(blob, "correos_extraidos.csv");
};

// Función para exportar a JSON
export const exportToJSON = (emailGroups: EmailGroups) => {
  const jsonData = JSON.stringify(emailGroups, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  downloadFile(blob, "correos_extraidos.json");
};

// Función para exportar a Excel por dominios
export const exportToExcelByDomains = (emailGroups: EmailGroups) => {
  const { personal, corporate, educational, others } = emailGroups;
  
  // Crear un nuevo libro de Excel
  const workbook = XLSX.utils.book_new();
  
  // Crear hojas separadas para cada tipo de correo
  const exportByDomainToSheet = (domainMap: Record<string, string[]>, sheetName: string) => {
    // Obtener todos los dominios para este tipo de correo
    const domains = Object.keys(domainMap);
    
    if (domains.length === 0) {
      return null; // No crear hoja si no hay dominios
    }
    
    // Crear una matriz de encabezados (dominios)
    const headers = domains;
    
    // Encontrar la cantidad máxima de correos en cualquier dominio
    const maxEmails = Math.max(...domains.map(domain => domainMap[domain].length));
    
    // Crear la matriz de datos
    const data = [headers];
    
    // Llenar las filas con los correos electrónicos
    for (let i = 0; i < maxEmails; i++) {
      const row = domains.map(domain => {
        return i < domainMap[domain].length ? domainMap[domain][i] : "";
      });
      data.push(row);
    }
    
    // Convertir la matriz a una hoja de trabajo
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Ajustar el ancho de las columnas
    const colWidths = domains.map(() => ({ wch: 30 }));
    ws['!cols'] = colWidths;
    
    return { worksheet: ws, name: sheetName };
  };
  
  // Crear hoja para cada tipo de correo
  const sheets = [
    exportByDomainToSheet(personal, "Correos Personales"),
    exportByDomainToSheet(corporate, "Correos Corporativos"),
    exportByDomainToSheet(educational, "Correos Educativos"),
    exportByDomainToSheet(others, "Otros Correos")
  ].filter(sheet => sheet !== null);
  
  // Añadir las hojas al libro
  sheets.forEach(sheet => {
    if (sheet) {
      XLSX.utils.book_append_sheet(workbook, sheet.worksheet, sheet.name);
    }
  });
  
  // Exportar y descargar
  XLSX.writeFile(workbook, "correos_por_dominios.xlsx");
};

// Función para exportar a Excel por categorías
export const exportToExcelByCategories = (emailGroups: EmailGroups) => {
  const { personal, corporate, educational, others } = emailGroups;
  
  // Crear un nuevo libro de Excel
  const workbook = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([
    ["Correos Personales", "Correos Corporativos", "Correos Educativos", "Otros Correos"]
  ]);
  
  // Convertir los correos en columnas verticales
  const personalEmails = Object.values(personal).flat();
  const corporateEmails = Object.values(corporate).flat();
  const educationalEmails = Object.values(educational).flat();
  const otherEmails = Object.values(others).flat();
  
  // Encontrar la longitud máxima
  const maxRows = Math.max(
    personalEmails.length,
    corporateEmails.length,
    educationalEmails.length,
    otherEmails.length
  );
  
  // Agregar cada fila
  for (let i = 0; i < maxRows; i++) {
    const row = [
      i < personalEmails.length ? personalEmails[i] : "",
      i < corporateEmails.length ? corporateEmails[i] : "",
      i < educationalEmails.length ? educationalEmails[i] : "",
      i < otherEmails.length ? otherEmails[i] : ""
    ];
    
    // Agregar al worksheet en la posición correspondiente
    XLSX.utils.sheet_add_aoa(ws, [row], { origin: -1 });
  }
  
  // Añadir la hoja al libro
  XLSX.utils.book_append_sheet(workbook, ws, "Correos por Categorías");
  
  // Exportar y descargar
  XLSX.writeFile(workbook, "correos_por_categorias.xlsx");
};

// Función auxiliar para descargar archivos
const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

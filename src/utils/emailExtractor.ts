
import { EmailGroups } from "@/types";

// Función para extraer correos electrónicos de un texto
export function extractEmails(text: string): string[] {
  // Expresión regular para encontrar correos electrónicos
  const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}/g;
  const matches = text.match(emailRegex);
  return matches ? matches : [];
}

// Función para categorizar correos por tipo y dominio
export function categorizeEmails(emails: string[]): EmailGroups {
  const result: EmailGroups = {
    personal: {},
    corporate: {},
    educational: {},
    others: {}
  };

  // Dominios comunes para correos personales
  const personalDomains = [
    'gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 
    'icloud.com', 'aol.com', 'protonmail.com', 'mail.com',
    'zoho.com', 'yandex.com'
  ];

  // Sufijos comunes para correos educativos
  const educationalSuffixes = ['.edu', '.ac.', '.edu.'];

  emails.forEach(email => {
    // Obtener el dominio después del @
    const atIndex = email.lastIndexOf('@');
    const domain = email.substring(atIndex + 1).toLowerCase();

    // Categorizar el correo según su dominio
    if (personalDomains.includes(domain)) {
      // Correo personal
      if (!result.personal[domain]) {
        result.personal[domain] = [];
      }
      result.personal[domain].push(email);
    } else if (educationalSuffixes.some(suffix => domain.includes(suffix))) {
      // Correo educativo
      if (!result.educational[domain]) {
        result.educational[domain] = [];
      }
      result.educational[domain].push(email);
    } else {
      // Asumir que es corporativo para dominios personalizados que no son educativos
      // (Esta lógica podría mejorarse con una lista más completa o un servicio externo)
      if (!result.corporate[domain]) {
        result.corporate[domain] = [];
      }
      result.corporate[domain].push(email);
    }
  });

  return result;
}

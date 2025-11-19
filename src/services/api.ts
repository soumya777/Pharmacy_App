import { Medicine, AddMedicineDto } from '../types';

const API_BASE_URL = 'https://localhost:5225/api';

const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

const toPascalCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(item => toPascalCase(item));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
      result[pascalKey] = toPascalCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

export const medicineApi = {
  getAllMedicines: async (): Promise<Medicine[]> => {
    const response = await fetch(`${API_BASE_URL}/medicines`);
    if (!response.ok) throw new Error('Failed to fetch medicines');
    const data = await response.json();
    return toCamelCase(data);
  },

  addMedicine: async (medicine: AddMedicineDto): Promise<Medicine> => {
    const pascalCaseData = toPascalCase(medicine);
    const response = await fetch(`${API_BASE_URL}/medicines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pascalCaseData),
    });
    if (!response.ok) throw new Error('Failed to add medicine');
    const data = await response.json();
    return toCamelCase(data);
  }
};
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './config';
import { generateHouseholdCode } from '../utils/household';

export const householdService = {
  // Generate household code for existing household
  async generateCode(householdId: string): Promise<string> {
    const code = generateHouseholdCode();
    await updateDoc(doc(db, 'households', householdId), {
      householdCode: code,
    });
    return code;
  },
};


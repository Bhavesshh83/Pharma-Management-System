
export interface OpenFDAResult {
  brand_name?: string;
  generic_name?: string;
  manufacturer_name?: string;
  route?: string[];
  substance_name?: string;
  product_ndc?: string;
  dosage_form?: string;
  strength?: string;
  active_ingredient?: any[];
}

export interface DrugVerificationResult {
  isVerified: boolean;
  fdaData?: OpenFDAResult;
  confidence: number;
  matchType: 'exact' | 'partial' | 'generic' | 'brand';
}

const OPENFDA_BASE_URL = 'https://api.fda.gov/drug';

export const verifyDrugWithOpenFDA = async (drugName: string): Promise<DrugVerificationResult> => {
  try {
    console.log('Verifying drug with OpenFDA:', drugName);
    
    // Clean the drug name for better API matching
    const cleanDrugName = cleanDrugNameForAPI(drugName);
    
    // Try multiple search strategies
    const searchResults = await Promise.allSettled([
      searchByBrandName(cleanDrugName),
      searchByGenericName(cleanDrugName),
      searchByActiveIngredient(cleanDrugName)
    ]);
    
    // Process results and find the best match
    for (const result of searchResults) {
      if (result.status === 'fulfilled' && result.value) {
        return result.value;
      }
    }
    
    console.log('No FDA verification found for:', drugName);
    return {
      isVerified: false,
      confidence: 0,
      matchType: 'exact'
    };
    
  } catch (error) {
    console.error('OpenFDA API error:', error);
    return {
      isVerified: false,
      confidence: 0,
      matchType: 'exact'
    };
  }
};

const searchByBrandName = async (drugName: string): Promise<DrugVerificationResult | null> => {
  try {
    const response = await fetch(
      `${OPENFDA_BASE_URL}/label.json?search=openfda.brand_name:"${drugName}"&limit=1`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          isVerified: true,
          fdaData: result.openfda,
          confidence: 0.95,
          matchType: 'brand'
        };
      }
    }
  } catch (error) {
    console.error('Brand name search error:', error);
  }
  return null;
};

const searchByGenericName = async (drugName: string): Promise<DrugVerificationResult | null> => {
  try {
    const response = await fetch(
      `${OPENFDA_BASE_URL}/label.json?search=openfda.generic_name:"${drugName}"&limit=1`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          isVerified: true,
          fdaData: result.openfda,
          confidence: 0.9,
          matchType: 'generic'
        };
      }
    }
  } catch (error) {
    console.error('Generic name search error:', error);
  }
  return null;
};

const searchByActiveIngredient = async (drugName: string): Promise<DrugVerificationResult | null> => {
  try {
    const response = await fetch(
      `${OPENFDA_BASE_URL}/label.json?search=openfda.substance_name:"${drugName}"&limit=1`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          isVerified: true,
          fdaData: result.openfda,
          confidence: 0.85,
          matchType: 'exact'
        };
      }
    }
  } catch (error) {
    console.error('Active ingredient search error:', error);
  }
  return null;
};

export const batchVerifyDrugs = async (drugNames: string[]): Promise<Record<string, DrugVerificationResult>> => {
  console.log('Batch verifying drugs with OpenFDA:', drugNames);
  
  const results: Record<string, DrugVerificationResult> = {};
  
  // Process drugs in batches to avoid rate limiting
  const batchSize = 3;
  for (let i = 0; i < drugNames.length; i += batchSize) {
    const batch = drugNames.slice(i, i + batchSize);
    
    const batchPromises = batch.map(async (drugName) => {
      const result = await verifyDrugWithOpenFDA(drugName);
      results[drugName] = result;
      // Add delay between requests to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 200));
    });
    
    await Promise.allSettled(batchPromises);
  }
  
  console.log('FDA verification results:', results);
  return results;
};

const cleanDrugNameForAPI = (drugName: string): string => {
  return drugName
    .toLowerCase()
    .replace(/\d+(\.\d+)?\s*(mg|ml|gm|mcg|g|tab|tablet|capsule|cap|syrup|injection|inj)/gi, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const getDrugInteractions = async (drugName: string): Promise<any[]> => {
  try {
    const response = await fetch(
      `${OPENFDA_BASE_URL}/event.json?search=patient.drug.medicinalproduct:"${drugName}"&count=patient.reaction.reactionmeddrapt.exact&limit=10`
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.results || [];
    }
  } catch (error) {
    console.error('Drug interactions API error:', error);
  }
  return [];
};

export const searchDrugsByNDC = async (ndc: string): Promise<OpenFDAResult | null> => {
  try {
    const response = await fetch(
      `${OPENFDA_BASE_URL}/ndc.json?search=product_ndc:"${ndc}"&limit=1`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0];
      }
    }
  } catch (error) {
    console.error('NDC search error:', error);
  }
  return null;
};

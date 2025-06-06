
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ShoppingCart } from 'lucide-react';
import { PrescriptionData } from '@/services/ocrService';
import { useCart } from '@/contexts/CartContext';
import { medicines } from '@/data/medicines';
import { toast } from '@/hooks/use-toast';

interface PrescriptionVerificationProps {
  prescriptionData: PrescriptionData;
  onApprove: () => void;
  onReject: () => void;
}

const PrescriptionVerification: React.FC<PrescriptionVerificationProps> = ({
  prescriptionData,
  onApprove,
  onReject
}) => {
  const [verifiedMedicines, setVerifiedMedicines] = useState<string[]>([]);
  const { addToCart } = useCart();

  const findMatchingMedicines = (extractedMedicines: string[]) => {
    const matches: Array<{ extracted: string; medicine: any; confidence: number }> = [];
    
    extractedMedicines.forEach(extracted => {
      const bestMatch = medicines.find(medicine => {
        const medicineName = medicine.name.toLowerCase();
        const extractedName = extracted.toLowerCase();
        
        // Check for exact match or partial match
        return medicineName.includes(extractedName) || 
               extractedName.includes(medicineName) ||
               medicineName.split(' ').some(word => extractedName.includes(word));
      });
      
      if (bestMatch) {
        matches.push({
          extracted,
          medicine: bestMatch,
          confidence: 0.8 // Simplified confidence score
        });
      }
    });
    
    return matches;
  };

  const matchedMedicines = findMatchingMedicines(prescriptionData.medicines);

  const handleAddToCart = (medicine: any) => {
    addToCart(medicine, 1);
    setVerifiedMedicines(prev => [...prev, medicine.id]);
    toast({
      title: "Medicine added to cart",
      description: `${medicine.name} has been added to your cart`,
    });
  };

  const handleApproveAll = () => {
    matchedMedicines.forEach(({ medicine }) => {
      if (!verifiedMedicines.includes(medicine.id)) {
        addToCart(medicine, 1);
      }
    });
    
    toast({
      title: "Prescription approved",
      description: `${matchedMedicines.length} medicines added to cart`,
    });
    
    onApprove();
  };

  return (
    <div className="space-y-6">
      {/* Extracted Information */}
      <Card>
        <CardHeader>
          <CardTitle>Extracted Prescription Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">Doctor Name</label>
              <p className="text-lg">{prescriptionData.doctorName}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">Patient Name</label>
              <p className="text-lg">{prescriptionData.patientName}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600">Upload Date</label>
            <p className="text-lg">{prescriptionData.uploadDate}</p>
          </div>
        </CardContent>
      </Card>

      {/* Detected Medicines */}
      <Card>
        <CardHeader>
          <CardTitle>Detected Medicines ({matchedMedicines.length} found)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {matchedMedicines.map(({ extracted, medicine, confidence }, index) => (
            <div key={index} className="border rounded-lg p-4 flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold">{medicine.name}</h4>
                  <Badge variant="secondary">₹{medicine.price}</Badge>
                  <Badge variant={confidence > 0.7 ? "default" : "secondary"}>
                    {Math.round(confidence * 100)}% match
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">Extracted: "{extracted}"</p>
                <p className="text-sm text-gray-500">{medicine.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {verifiedMedicines.includes(medicine.id) ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Added
                  </Badge>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={() => handleAddToCart(medicine)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {matchedMedicines.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <XCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No medicines detected</h3>
              <p>Please ensure the prescription image is clear and legible</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Raw Text */}
      <Card>
        <CardHeader>
          <CardTitle>Raw Extracted Text</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg max-h-32 overflow-y-auto">
            <pre className="text-sm whitespace-pre-wrap">{prescriptionData.rawText}</pre>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          onClick={handleApproveAll} 
          className="flex-1 bg-green-600 hover:bg-green-700"
          disabled={matchedMedicines.length === 0}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Approve & Add All to Cart
        </Button>
        <Button 
          onClick={onReject} 
          variant="destructive" 
          className="flex-1"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Reject Prescription
        </Button>
      </div>
    </div>
  );
};

export default PrescriptionVerification;

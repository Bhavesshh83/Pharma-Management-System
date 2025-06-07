
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ShoppingCart, Database } from 'lucide-react';
import { PrescriptionData } from '@/services/ocrService';
import { useCart } from '@/contexts/CartContext';
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

  const handleAddToCart = (medicine: any) => {
    addToCart(medicine, 1);
    setVerifiedMedicines(prev => [...prev, medicine.id]);
    toast({
      title: "Medicine added to cart",
      description: `${medicine.name} has been added to your cart`,
    });
  };

  const handleApproveAll = () => {
    const medicineMatches = prescriptionData.medicineMatches || [];
    medicineMatches.forEach(({ medicine }) => {
      if (!verifiedMedicines.includes(medicine.id)) {
        addToCart(medicine, 1);
      }
    });
    
    toast({
      title: "Prescription approved",
      description: `${medicineMatches.length} medicines added to cart`,
    });
    
    onApprove();
  };

  const medicineMatches = prescriptionData.medicineMatches || [];

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
          {prescriptionData.prescriptionId && (
            <div>
              <label className="text-sm font-semibold text-gray-600">Prescription ID</label>
              <p className="text-sm text-gray-500">{prescriptionData.prescriptionId}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detected & Matched Medicines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Detected Medicines ({medicineMatches.length} matches found)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {medicineMatches.map((match, index) => {
            const { medicine, confidence, rxnormMatch } = match;
            return (
              <div key={index} className="border rounded-lg p-4 flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{medicine.name}</h4>
                    <Badge variant="secondary">₹{medicine.price}</Badge>
                    <Badge variant={confidence > 0.8 ? "default" : "secondary"}>
                      {Math.round(confidence * 100)}% match
                    </Badge>
                    {rxnormMatch && (
                      <Badge className="bg-green-100 text-green-800">
                        RxNorm Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{medicine.description}</p>
                  <p className="text-sm text-gray-500">
                    Manufacturer: {medicine.manufacturer}
                    {medicine.rxnorm_code && ` | RxNorm: ${medicine.rxnorm_code}`}
                  </p>
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
            );
          })}
          
          {medicineMatches.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <XCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No medicines matched</h3>
              <p>The extracted medicines could not be found in our database</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Extracted Medicine Names */}
      <Card>
        <CardHeader>
          <CardTitle>Raw Extracted Medicine Names</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {prescriptionData.medicines.map((medicine, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {medicine}
              </Badge>
            ))}
          </div>
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
          disabled={medicineMatches.length === 0}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Approve & Add All to Cart ({medicineMatches.length})
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

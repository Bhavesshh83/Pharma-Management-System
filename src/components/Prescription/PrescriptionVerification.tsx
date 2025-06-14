
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ShoppingCart, Database, Shield } from 'lucide-react';
import { PrescriptionData } from '@/services/ocrService';

interface PrescriptionVerificationProps {
  prescriptionData: PrescriptionData;
  hideActions?: boolean;
  // onApprove and onReject are no longer used for user upload flow
}

const PrescriptionVerification: React.FC<PrescriptionVerificationProps> = ({
  prescriptionData,
  hideActions = false, // controls the actions UI, default = false for dashboards
}) => {
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

      {/* Detected & Matched Medicines with FDA Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Detected Medicines ({medicineMatches.length} matches found)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {medicineMatches.map((match, index) => {
            const { medicine, confidence, rxnormMatch, fdaVerification } = match;
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
                    {fdaVerification?.isVerified && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <Shield className="h-3 w-3 mr-1" />
                        FDA Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{medicine.description}</p>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>Manufacturer: {medicine.manufacturer}</p>
                    {medicine.rxnorm_code && <p>RxNorm: {medicine.rxnorm_code}</p>}
                    {fdaVerification?.isVerified && fdaVerification.fdaData && (
                      <div className="bg-blue-50 p-2 rounded mt-2">
                        <p className="font-medium text-blue-800">FDA Information:</p>
                        {fdaVerification.fdaData.brand_name && (
                          <p>Brand: {fdaVerification.fdaData.brand_name}</p>
                        )}
                        {fdaVerification.fdaData.generic_name && (
                          <p>Generic: {fdaVerification.fdaData.generic_name}</p>
                        )}
                        {fdaVerification.fdaData.manufacturer_name && (
                          <p>FDA Manufacturer: {fdaVerification.fdaData.manufacturer_name}</p>
                        )}
                        <p>Match Type: {fdaVerification.matchType}</p>
                        <p>FDA Confidence: {Math.round(fdaVerification.confidence * 100)}%</p>
                      </div>
                    )}
                  </div>
                </div>
                {/* Remove Add to Cart and "Added" buttons for user */}
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

      {/* Hide action buttons for user */}
      {!hideActions && (
        <div className="flex gap-4">
          {/* This section can be enabled for pharmacist dashboard etc. */}
        </div>
      )}
    </div>
  );
};

export default PrescriptionVerification;


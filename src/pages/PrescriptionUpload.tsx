import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, FileText, CheckCircle, Eye, Brain, Database } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { extractPrescriptionData, PrescriptionData } from '@/services/ocrService';
import PrescriptionVerification from '@/components/Prescription/PrescriptionVerification';
import { useCart } from '@/contexts/CartContext';

const PrescriptionUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'success' | 'error'>('idle');
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPEG, PNG, or PDF file",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);
    setUploadStatus('uploading');

    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUploadStatus('processing');
      
      // Process prescription with OCR and database matching
      const extractedData = await extractPrescriptionData(selectedFile);
      setPrescriptionData(extractedData);

      // Auto-approve if medicines matched, add to cart
      const medicineMatches = extractedData.medicineMatches || [];
      if (medicineMatches.length > 0) {
        // Add each matched medicine to cart (default quantity: 1)
        medicineMatches.forEach(({ medicine }) => {
          addToCart(medicine, 1);
        });

        setUploadStatus('success');
        toast({
          title: "Prescription processed and medicines added!",
          description: `${medicineMatches.length} matched medicines auto-added to your cart.`,
        });
        // Redirect to cart after a short delay
        setTimeout(() => {
          navigate('/cart');
        }, 2000);
      } else {
        setUploadStatus('error');
        toast({
          title: "Prescription processed",
          description: "No medicines matched. Please try another clear prescription.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setUploadStatus('error');
      toast({
        title: "Processing failed",
        description: "Failed to extract prescription data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // No reject handling needed for user
  // No manual approve

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please login to upload prescription</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/auth">Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Upload Prescription
          </h1>
          
          {/* Only show verification if processed but NO medicine match */}
          {uploadStatus === 'error' && prescriptionData && prescriptionData.medicineMatches && prescriptionData.medicineMatches.length === 0 ? (
            <PrescriptionVerification
              prescriptionData={prescriptionData}
              hideActions // <--- tell comp to hide all actions
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  AI-Powered Prescription Processing
                </CardTitle>
                <CardDescription>
                  Upload your prescription for AI-powered OCR extraction, RxNorm verification, and automatic medicine matching from our database
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {uploadStatus === 'success' ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-green-600 mb-2">
                      Prescription Processed Successfully!
                    </h3>
                    <p className="text-gray-600">
                      Your medicines have been added to cart. Redirecting to cart...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="prescription">Select Prescription File</Label>
                      <Input
                        id="prescription"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileSelect}
                        disabled={uploading}
                      />
                      <p className="text-sm text-gray-500">
                        Supported formats: JPEG, PNG, PDF (Max size: 5MB)
                      </p>
                    </div>

                    {selectedFile && (
                      <Card className="p-4 bg-blue-50">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="font-medium">{selectedFile.name}</p>
                            <p className="text-sm text-gray-500">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      </Card>
                    )}

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-800 mb-2 flex items-center">
                        <Brain className="h-4 w-4 mr-2" />
                        AI-Powered Features:
                      </h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Advanced OCR text extraction from prescription images</li>
                        <li>• Smart detection of doctor name, patient name, and medicines</li>
                        <li>• RxNorm API integration for medicine standardization</li>
                        <li>• Intelligent medicine matching with database inventory</li>
                        <li>• Confidence scoring for extracted medicines</li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                        <Database className="h-4 w-4 mr-2" />
                        Database Integration:
                      </h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Prescription data stored securely in Supabase</li>
                        <li>• Real-time medicine inventory matching</li>
                        <li>• RxNorm code verification for accuracy</li>
                        <li>• Automatic cart addition of verified medicines</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-medium text-yellow-800 mb-2">Important Guidelines:</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Ensure the prescription is clearly visible and legible</li>
                        <li>• Include doctor's name, signature, and clinic stamp</li>
                        <li>• Prescription should be recent (within 30 days)</li>
                        <li>• All medicine names should be clearly readable</li>
                      </ul>
                    </div>

                    <Button
                      onClick={handleUpload}
                      disabled={!selectedFile || uploading}
                      className="w-full"
                    >
                      {uploading ? (
                        <>
                          {uploadStatus === 'uploading' && (
                            <>
                              <Upload className="h-4 w-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          )}
                          {uploadStatus === 'processing' && (
                            <>
                              <Brain className="h-4 w-4 mr-2 animate-pulse" />
                              Processing with AI & RxNorm...
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Process with AI & Database Matching
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionUpload;

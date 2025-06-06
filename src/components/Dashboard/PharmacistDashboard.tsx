
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PharmacistDashboard = () => {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 'P001',
      patientName: 'Alice Brown',
      uploadedAt: '2024-06-06 09:30',
      status: 'pending',
      medicines: ['Azithromycin 500mg', 'Paracetamol 650mg'],
      doctorName: 'Dr. Smith',
      prescriptionImage: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop'
    },
    {
      id: 'P002',
      patientName: 'Bob Davis',
      uploadedAt: '2024-06-06 08:15',
      status: 'under_review',
      medicines: ['Metformin 500mg', 'Insulin'],
      doctorName: 'Dr. Johnson',
      prescriptionImage: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop'
    },
    {
      id: 'P003',
      patientName: 'Carol White',
      uploadedAt: '2024-06-06 07:45',
      status: 'verified',
      medicines: ['Amoxicillin 250mg', 'Cough Syrup'],
      doctorName: 'Dr. Wilson',
      prescriptionImage: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=300&fit=crop'
    }
  ]);

  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);

  const handleVerify = (prescriptionId: string) => {
    setPrescriptions(prev => prev.map(p => 
      p.id === prescriptionId ? { ...p, status: 'verified' } : p
    ));
    toast({
      title: "Prescription Verified",
      description: `Prescription ${prescriptionId} has been approved`,
    });
    setSelectedPrescription(null);
  };

  const handleReject = (prescriptionId: string) => {
    setPrescriptions(prev => prev.map(p => 
      p.id === prescriptionId ? { ...p, status: 'rejected' } : p
    ));
    toast({
      title: "Prescription Rejected",
      description: `Prescription ${prescriptionId} has been rejected`,
      variant: "destructive",
    });
    setSelectedPrescription(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'under_review': return <Clock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const pendingCount = prescriptions.filter(p => p.status === 'pending').length;
  const reviewCount = prescriptions.filter(p => p.status === 'under_review').length;
  const verifiedToday = prescriptions.filter(p => p.status === 'verified').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Pharmacist Dashboard</h1>
          <p className="text-gray-600">Review and verify prescription uploads</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Under Review</p>
                  <p className="text-2xl font-bold text-yellow-600">{reviewCount}</p>
                </div>
                <FileText className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Verified Today</p>
                  <p className="text-2xl font-bold text-green-600">{verifiedToday}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Prescription List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Prescription Queue</CardTitle>
                <CardDescription>Review uploaded prescriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="pending" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="review">Review</TabsTrigger>
                    <TabsTrigger value="verified">Verified</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                  </TabsList>

                  {['pending', 'under_review', 'verified', 'rejected'].map(status => (
                    <TabsContent 
                      key={status} 
                      value={status === 'under_review' ? 'review' : status}
                      className="space-y-4"
                    >
                      {prescriptions
                        .filter(p => p.status === status)
                        .map((prescription) => (
                          <div 
                            key={prescription.id} 
                            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-semibold">{prescription.id}</h4>
                                <p className="text-sm text-gray-600">Patient: {prescription.patientName}</p>
                                <p className="text-sm text-gray-500">Uploaded: {prescription.uploadedAt}</p>
                                <p className="text-sm text-gray-600">Doctor: {prescription.doctorName}</p>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(prescription.status)}>
                                  {getStatusIcon(prescription.status)}
                                  <span className="ml-1 capitalize">{prescription.status.replace('_', ' ')}</span>
                                </Badge>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedPrescription(prescription)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">Medicines:</p>
                              <div className="flex flex-wrap gap-2">
                                {prescription.medicines.map((medicine, index) => (
                                  <Badge key={index} variant="secondary">
                                    {medicine}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {prescription.status === 'pending' && (
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setPrescriptions(prev => prev.map(p => 
                                      p.id === prescription.id ? { ...p, status: 'under_review' } : p
                                    ));
                                    setSelectedPrescription(prescription);
                                  }}
                                >
                                  Start Review
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      
                      {prescriptions.filter(p => p.status === status).length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No prescriptions in {status.replace('_', ' ')} status</p>
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Prescription Review Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Prescription Review</CardTitle>
                <CardDescription>
                  {selectedPrescription ? 'Review prescription details' : 'Select a prescription to review'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedPrescription ? (
                  <div className="space-y-4">
                    <div>
                      <img
                        src={selectedPrescription.prescriptionImage}
                        alt="Prescription"
                        className="w-full rounded-lg border"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold">Patient Details</h4>
                      <p className="text-sm"><strong>Name:</strong> {selectedPrescription.patientName}</p>
                      <p className="text-sm"><strong>Doctor:</strong> {selectedPrescription.doctorName}</p>
                      <p className="text-sm"><strong>Date:</strong> {selectedPrescription.uploadedAt}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold">Prescribed Medicines</h4>
                      {selectedPrescription.medicines.map((medicine: string, index: number) => (
                        <Badge key={index} variant="secondary" className="block w-fit">
                          {medicine}
                        </Badge>
                      ))}
                    </div>

                    {selectedPrescription.status !== 'verified' && selectedPrescription.status !== 'rejected' && (
                      <div className="flex space-x-2 pt-4">
                        <Button
                          onClick={() => handleVerify(selectedPrescription.id)}
                          className="flex-1"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Verify
                        </Button>
                        <Button
                          onClick={() => handleReject(selectedPrescription.id)}
                          variant="destructive"
                          className="flex-1"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a prescription from the list to start reviewing</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;

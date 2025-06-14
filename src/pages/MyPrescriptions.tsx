
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { File, Check, Clock, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface Prescription {
  id: string;
  uploaded_at: string;
  image_url: string;
  status: string;
  medicines: string[];
  ocr_data: any;
}

const statusColor = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800"
};

const MyPrescriptions = () => {
  const { user } = useAuth();
  const [data, setData] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!user) return setLoading(false);

      const { data: presc, error } = await supabase
        .from("prescriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("uploaded_at", { ascending: false });

      if (!error && presc) setData(presc as any[]);
      setLoading(false);
    };
    fetchPrescriptions();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Please Login</CardTitle>
            <CardDescription>You need to log in to see your prescriptions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/auth" className="btn btn-primary">Login</Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (loading) return <div className="text-center py-12">Loading prescriptions...</div>;

  return (
    <div className="container max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">My Prescriptions</h1>
      {data.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <XCircle className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <p className="text-lg text-gray-500">No prescriptions uploaded yet.</p>
            <Link to="/prescription-upload" className="text-blue-600 underline mt-2 block">Upload Prescription</Link>
          </CardContent>
        </Card>
      )}
      <div className="space-y-4">
        {data.map(p => (
          <Card key={p.id}>
            <CardHeader className="flex flex-row items-center">
              <File className="h-6 w-6 text-blue-600 mr-3" />
              <CardTitle>Prescription uploaded {new Date(p.uploaded_at).toLocaleDateString()}</CardTitle>
              <span className={`ml-auto px-2 py-1 rounded text-xs font-semibold ${statusColor[p.status as keyof typeof statusColor] || 'bg-gray-100 text-gray-800'}`}>
                {p.status}
              </span>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <img
                  src={p.image_url}
                  alt="Prescription"
                  className="max-w-xs h-auto rounded border"
                  style={{ maxHeight: 140 }}
                />
                <div>
                  <div className="mb-2">
                    <Badge>Medicines: {p.medicines?.length || 0}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {p.medicines?.map((m: string, idx: number) => (
                      <Badge key={idx} variant="outline">{m}</Badge>
                    ))}
                  </div>
                  {p.ocr_data?.doctorName && (
                    <div className="mb-1 text-gray-800 text-sm">
                      Doctor: <span className="font-medium">{p.ocr_data.doctorName}</span>
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Status: <span className="font-semibold">{p.status}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyPrescriptions;


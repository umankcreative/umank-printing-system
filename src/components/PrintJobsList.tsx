import React from "react";
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card1";
import Badge from "./ui/badge";
import { PrintJob, PrintJobStatus } from "../types/api";
import { Clock, Printer, CheckCircle, AlertCircle, RefreshCcw } from "lucide-react";
import { printJobService } from "../services/printJobService";

// Helper functions (tetap sama)
const getStatusIcon = (status: PrintJobStatus) => {
  switch (status) {
    case "pending":
      return <Clock size={16} className="text-amber-500" />;
    case "printing":
      return <RefreshCcw size={16} className="text-blue-500 animate-spin" />;
    case "completed":
      return <CheckCircle size={16} className="text-green-500" />;
    case "failed":
      return <AlertCircle size={16} className="text-red-500" />;
    default:
      return <Clock size={16} />;
  }
};

const getStatusBadge = (status: PrintJobStatus) => {
  switch (status) {
    case "pending":
      return <Badge text='Menunggu' className="bg-amber-100 text-amber-800 border-amber-200"></Badge>;
    case "printing":
      return <Badge text='Mencetak' className="bg-blue-100 text-blue-800 border-blue-200"></Badge>;
    case "completed":
      return <Badge text='Selesai' className="bg-green-100 text-green-800 border-green-200"></Badge>;
    case "failed":
      return <Badge text='Gagal' className="bg-red-100 text-red-800 border-red-200"></Badge>;
    default:
      return <Badge text='Tidak Diketahui'></Badge>;
  }
};

const formatDate = (date: Date | string) => {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - d.getTime()) / (1000 * 60));
  if (diffInMinutes < 1) return "Baru saja";
  if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam lalu`;
  return d.toLocaleDateString('id-ID');
};

const PrintJobsList = () => {
  // Menggunakan useQuery dari react-query
  const {
    data: printJobs = [], // 'data' berisi hasil dari queryFn. Beri nilai default array kosong.
    isLoading,         // true saat data sedang diambil untuk pertama kali
    isFetching,        // true saat data sedang diambil (termasuk refetch di latar belakang)
    isError,           // true jika ada error saat fetching
    error,             // Objek error jika isError true
  } = useQuery<PrintJob[], Error>({
    queryKey: ['printJobs'], // Kunci unik untuk query ini. Digunakan untuk caching dan invalidasi.
    queryFn: printJobService.getPrintJobs, // Fungsi yang akan memanggil API
    staleTime: 1000 * 60 * 1, // Data dianggap segar selama 1 menit (tidak akan refetch jika kurang dari ini)
    refetchInterval: 1000 * 10, // Opsional: Refetch data setiap 10 detik untuk real-time (bisa disesuaikan)
    refetchOnWindowFocus: true, // Opsional: Refetch saat window mendapatkan fokus kembali
    onError: (err) => {
      console.error("Failed to fetch print jobs:", err);
      // Anda bisa menambahkan toast atau notifikasi di sini
    },
  });

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Printer className="text-primary" size={20} />
          Pekerjaan Cetak Aktif
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? ( // Menggunakan isLoading dari useQuery
          <div className="text-center py-6 text-muted-foreground">
            Memuat pekerjaan cetak...
          </div>
        ) : isError ? ( // Menampilkan error jika ada
          <div className="text-center py-6 text-red-500">
            Gagal memuat pekerjaan cetak: {error?.message}
          </div>
        ) : printJobs.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Tidak ada pekerjaan cetak aktif
          </div>
        ) : (
          <div className="space-y-4">
            {printJobs.map((job) => (
              <div
                key={job.id}
                className="print-job-container bg-card border rounded-md p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium truncate max-w-[70%]">{job.name}</div>
                  {getStatusBadge(job.status)}
                </div>
                <div className="text-sm text-muted-foreground mb-3 truncate">
                  {job.fileName} ({job.pages} halaman)
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(job.status)}
                    <span>
                      {job.status === "printing" ? "Sedang mencetak" :
                       job.status === "pending" ? "Menunggu cetak" :
                       job.status === "completed" ? "Selesai mencetak" :
                       "Gagal mencetak"}
                    </span>
                  </div>
                  <div>
                    {job.created_at ? formatDate(new Date(job.created_at)): "Tidak diketahui"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrintJobsList;
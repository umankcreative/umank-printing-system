import React, { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card1";
import Badge from "./ui/badge";
import { PrintJob, PrintJobStatus } from "../types/api";
import { Clock, Printer, CheckCircle, AlertCircle, RefreshCcw, List, LayoutGrid } from "lucide-react";
import { printJobService } from "../services/printJobService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from "./ui/button";

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
  const [view, setView] = useState<'card' | 'table'>('card');

  const {
    data: printJobs = [],
    isLoading,
    isError,
    error,
  } = useQuery<PrintJob[], Error>({
    queryKey: ['printJobs'],
    queryFn: printJobService.getPrintJobs,
    staleTime: 1000 * 60 * 1,
    refetchInterval: 1000 * 10,
    refetchOnWindowFocus: true,
    onError: (err) => {
      console.error("Failed to fetch print jobs:", err);
    },
  });

  const renderCardView = () => (
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
  );

  const renderTableView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead>File</TableHead>
          <TableHead className="text-center">Halaman</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Waktu</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {printJobs.map((job) => (
          <TableRow key={job.id}>
            <TableCell className="font-medium">{job.name}</TableCell>
            <TableCell className="text-muted-foreground">{job.fileName}</TableCell>
            <TableCell className="text-center">{job.pages}</TableCell>
            <TableCell>{getStatusBadge(job.status)}</TableCell>
            <TableCell className="text-right text-muted-foreground">
              {job.created_at ? formatDate(new Date(job.created_at)) : "Tidak diketahui"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Card className="w-full mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Printer className="text-primary" size={20} />
          Pekerjaan Cetak Aktif
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant={view === 'card' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('card')}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={view === 'table' ? 'secondary' : 'ghost'} size="icon" onClick={() => setView('table')}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-6 text-muted-foreground">
            Memuat pekerjaan cetak...
          </div>
        ) : isError ? (
          <div className="text-center py-6 text-red-500">
            Gagal memuat pekerjaan cetak: {error?.message}
          </div>
        ) : printJobs.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Tidak ada pekerjaan cetak aktif
          </div>
        ) : (
          view === 'card' ? renderCardView() : renderTableView()
        )}
      </CardContent>
    </Card>
  );
};

export default PrintJobsList;

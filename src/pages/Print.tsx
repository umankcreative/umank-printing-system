import React, { useState } from "react";
import PrintJobForm from "../components/PrinJobForm";
import PrintJobsList from "../components/PrintJobsList";
import { Plus, Printer } from 'lucide-react';
// import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

const Print = () => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div>
      <div className="flex flex-col items-center justify-between">
      <div className="flex items-center justify-between w-full mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Printer className="h-6 w-6" />Pusat Cetak
        </h1>
        <button
          className="btn btn-outline-primary flex items-center"
          onClick={() => setShowDialog(true)}
        >
          <Plus className="w-5 h-5 mr-1" />
          Tambah Antrian Cetak
        </button>
      </div>
      <PrintJobsList />
      </div>
      
      {/* Dialog for adding new print job */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Antrian Cetak</DialogTitle>
          </DialogHeader>
          <PrintJobForm setShowDialog={setShowDialog} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Print;

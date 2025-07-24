
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "./ui/card1";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Printer, Upload, X, Link, Cloud } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { PrintJobStatus } from "../types/api";
import { printJobService } from '../services/printJobService';
// import { usePrintJobs } from "../hooks/usePrintJobs";
import CloudDriveSelector from "./CloudDriveSelector";

interface PrintJobFormProps {
  setShowDialog: (open: boolean) => void;
}

const PrintJobForm: React.FC<PrintJobFormProps> = ({ setShowDialog }) => {
  const { toast } = useToast();
  // const { createPrintJob } = usePrintJobs();
  const [jobName, setJobName] = useState("");
  const [copies, setCopies] = useState(1);
  const [color, setColor] = useState(false);
  const [doubleSided, setDoubleSided] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploadType, setUploadType] = useState<"file" | "url">("file");
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileUrl("");
      setFileName("");
    }
  };

  const handleCloudFileSelect = (url: string, name: string) => {
    setFileUrl(url);
    setFileName(name);
    setFile(null);
  };
  
  const resetForm = () => {
    setJobName("");
    setCopies(1);
    setColor(false);
    setDoubleSided(true);
    setFile(null);
    setFileUrl("");
    setFileName("");
    setUploadType("file");
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file && !fileUrl) {
      toast({
        title: "Error",
        description: "Please select a file to print or provide a cloud drive URL",
        variant: "destructive",
      });
      return;
    }

    const fileUploadUrl = fileUrl;
    let fileUploadName = fileName;

    // If file is uploaded, you may need to handle file upload to server here
    // For now, just use file.name
    if (file) {
      fileUploadName = file.name;
      // Optionally, upload file to server and get URL
      // fileUploadUrl = await uploadFileToServer(file);
    }

    const newJob = {
      name: jobName || fileUploadName,
      file_name: fileUploadName,
      fileUrl: fileUploadUrl || undefined,
      status: 'pending' as PrintJobStatus,
      pages: 1, // You may want to parse page count from file
      copies: copies,
      color: color,
      doubleSided: doubleSided,
    };

    console.log("Print job created successfully:", newJob);
    try {
      await printJobService.createPrintJob(newJob);
      toast({
        title: "Berhasil",
        description: "Antrian cetak berhasil ditambahkan.",
        variant: "default",
      });
      resetForm();
      if (setShowDialog) setShowDialog(false);
    } catch (err) {
      toast({
        title: "Gagal",
        description: "Gagal menambahkan antrian cetak. "+ (err instanceof Error ? err.message : "Unknown error"),
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="w-full mt-6 animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Printer className="text-primary" size={20} />
          Antrian Cetak Baru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="jobName">Nama (Optional)</Label>
            <Input 
              id="jobName" 
              value={jobName} 
              onChange={(e) => setJobName(e.target.value)}
              placeholder="contoh: antrian cetak untuk order #F45SD6E" 
            />
          </div>
          
          <div className="space-y-2">
            <Label>File Source</Label>
            <Tabs value={uploadType} onValueChange={(value) => setUploadType(value as "file" | "url")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="file" className="flex items-center gap-2">
                  <Upload size={16} />
                  Upload File
                </TabsTrigger>
                <TabsTrigger value="url" className="flex items-center gap-2">
                  <Cloud size={16} />
                  Cloud Drive
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="file" className="space-y-2">
                {!file ? (
                  <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => document.getElementById("file")?.click()}>
                    <Upload className="mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Klik untuk memilih file atau seret dan lepas di sini
                    </p>
                    <Input 
                      id="file" 
                      type="file" 
                      onChange={handleFileChange} 
                      className="hidden" 
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.bmp,.tiff"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                    <span className="truncate max-w-[200px]">{file.name}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setFile(null)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="url" className="space-y-4">
                <CloudDriveSelector onFileSelect={handleCloudFileSelect} />
                
                <div className="space-y-2">
                  <Label htmlFor="manualUrl">Atau paste URL link</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="manualUrl"
                      value={fileUrl} 
                      onChange={(e) => setFileUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/..." 
                    />
                    <Input 
                      value={fileName} 
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="File name" 
                      className="w-32"
                    />
                  </div>
                </div>

                {fileUrl && fileName && (
                  <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Link size={16} />
                      <span className="truncate max-w-[200px]">{fileName}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => {
                        setFileUrl("");
                        setFileName("");
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="copies">Rangkap</Label>
              <Input 
                id="copies" 
                type="number" 
                min={1} 
                max={100} 
                value={copies} 
                onChange={(e) => setCopies(parseInt(e.target.value) || 1)} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="color">Warna</Label>
                <Switch 
                  id="color" 
                  checked={color} 
                  onCheckedChange={setColor} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="doubleSided">Bolak-balik</Label>
                <Switch 
                  id="doubleSided" 
                  checked={doubleSided} 
                  onCheckedChange={setDoubleSided} 
                />
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setShowDialog(false)}>Batal</Button>
        <Button onClick={handleSubmit}>Cetak</Button>
      </CardFooter>
    </Card>
  );
};

export default PrintJobForm;
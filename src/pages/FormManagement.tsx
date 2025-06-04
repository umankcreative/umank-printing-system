import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from '../context/FormContext';
import { FormCategoryMapping } from '../types/formTypes';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card1';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Edit, Plus, Trash } from 'lucide-react';

const FormManagement: React.FC = () => {
  const { formTemplates, formCategoryMappings, deleteFormTemplate, updateCategoryMapping } = useForm();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [editingMapping, setEditingMapping] = useState<FormCategoryMapping | null>(null);
  const [isMappingDialogOpen, setIsMappingDialogOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('none');

  const handleOpenDeleteDialog = (templateId: string) => {
    setTemplateToDelete(templateId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (templateToDelete) {
      deleteFormTemplate(templateToDelete);
      setTemplateToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEditMapping = (mapping: FormCategoryMapping) => {
    setEditingMapping(mapping);
    setSelectedTemplateId(mapping.formTemplateId || 'none');
    setIsMappingDialogOpen(true);
  };

  const handleSaveMapping = () => {
    if (editingMapping) {
      updateCategoryMapping({
        ...editingMapping,
        formTemplateId: selectedTemplateId === 'none' ? '' : selectedTemplateId,
      });
      setEditingMapping(null);
      setIsMappingDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Form</h1>
          <p className="text-gray-500">Kelola template form dan hubungkan dengan kategori produk</p>
        </div>
        <Link to="/admin/form-builder/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Buat Template Baru
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates">Template Form</TabsTrigger>
          <TabsTrigger value="mappings">Pengaturan Kategori</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="mt-6">
          {formTemplates.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <p className="text-gray-500">
                  Belum ada template form yang dibuat. Klik tombol "Buat Template Baru" untuk membuat template form.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <CardTitle>{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">
                        {/* Jumlah elemen: {template.elements.length} */}
                      </p>
                      {template.category_id && (
                        <p className="text-sm text-gray-500">
                          Kategori: {template.category?.name || 'Tidak ada kategori'}
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link to={`/admin/form-builder/${template.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDeleteDialog(template.id)}
                    >
                      <Trash className="w-4 h-4 mr-2 text-red-500" />
                      Hapus
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mappings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Form Kategori</CardTitle>
              <CardDescription>
                Hubungkan template form dengan kategori produk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left">Kategori</th>
                      <th className="px-4 py-2 text-left">Template Form</th>
                      <th className="px-4 py-2 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {formCategoryMappings.map((mapping) => (
                      <tr key={mapping.categoryId}>
                        <td className="px-4 py-3 text-left">
                          {mapping.categoryName}
                        </td>
                        <td className="px-4 py-3 text-left">
                          {mapping.formTemplateId
                            ? formTemplates.find(t => t.id === mapping.formTemplateId)?.name || 'Template tidak ditemukan'
                            : 'Belum dipilih'}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditMapping(mapping)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Konfirmasi Delete */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penghapusan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus template form ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Edit Mapping */}
      <Dialog open={isMappingDialogOpen} onOpenChange={setIsMappingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pilih Template Form</DialogTitle>
            <DialogDescription>
              Pilih template form untuk kategori {editingMapping?.categoryName}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={selectedTemplateId}
              onValueChange={setSelectedTemplateId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih template form" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tidak ada template</SelectItem>
                {formTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMappingDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSaveMapping}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormManagement;
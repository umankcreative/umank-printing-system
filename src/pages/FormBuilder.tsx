import React, { useState, useEffect } from 'react';
import { useForm } from '../context/FormContext';
import { FormElement, FormElementType, FormTemplate, FormElementOption } from '../types/formTypes';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card1';
import { Plus, Save } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ElementTypeSelector from '../components/shop/FormBuilder/ElementTypeSelector';
import FormElementEditor from '../components/shop/FormBuilder/FormElementEditor';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableFormElement } from '../components/shop/FormBuilder/SortableFormElement';
import * as formService from '../services/formService';

const FormBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addFormTemplate, updateFormTemplate } = useForm();

  const [template, setTemplate] = useState<FormTemplate>({
    id: '',
    name: '',
    description: '',
    elements: [],
    category_id: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const [showElementSelector, setShowElementSelector] = useState(false);
  const [editingElement, setEditingElement] = useState<FormElement | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [hasLoaded, setHasLoaded] = useState(false);

useEffect(() => {
  const loadTemplate = async () => {
    if (id && id !== 'new') {
      setIsLoading(true);
      try {
        console.log('Loading template with id:', id);
        const loadedTemplate = await formService.getFormTemplate(id);

        const templateToSet = {
          id: loadedTemplate.id,
          name: loadedTemplate.name,
          description: loadedTemplate.description,
          elements: loadedTemplate.elements?.sort((a, b) => a.order - b.order) || [],
          category_id: loadedTemplate.category_id,
          created_at: loadedTemplate.created_at,
          updated_at: loadedTemplate.updated_at,
        };

        console.log('Setting template state to:', {
          id: templateToSet.id,
          name: templateToSet.name,
          description: templateToSet.description,
          elementsCount: templateToSet.elements.length
        });

        setTemplate(templateToSet);
        setHasLoaded(true); // ✅ hanya load sekali
      } catch (err) {
        console.error('Error loading template:', err);
        toast({
          title: 'Error',
          description: err instanceof Error ? err.message : 'Failed to load template',
          variant: 'destructive',
        });
        navigate('/admin/form-management');
      } finally {
        setIsLoading(false);
      }
    } else {
      const newTemplate = {
        id: uuidv4(),
        name: '',
        description: '',
        elements: [],
        category_id: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setTemplate(newTemplate);
      setHasLoaded(true);
    }
  };

  if (!hasLoaded) {
    loadTemplate();
  }
}, [id, hasLoaded, navigate]);


  // Add debug logging for template state changes
  useEffect(() => {
    console.log('Current template state:', {
      id: template.id,
      name: template.name,
      description: template.description,
      elementsCount: template.elements?.length
    });
  }, [template]);

  const handleAddElement = async (type: FormElementType) => {
  const defaultOptions: FormElementOption[] = ['select', 'checkbox', 'radio'].includes(type)
    ? [
      { label: 'Opsi 1', value: 'option1' },
      { label: 'Opsi 2', value: 'option2' },
    ]
    : [];

  const getElementTypeLabel = (type: FormElementType): string => {
    const typeLabels: Record<FormElementType, string> = {
      input: 'Input Teks',
      textarea: 'Area Teks',
      select: 'Pilihan Dropdown',
      checkbox: 'Kotak Centang',
      radio: 'Pilihan Radio',
      number: 'Input Angka',
      date: 'Input Tanggal',
      file: 'Upload File',
      email: 'Input Email',
      phone: 'Input Telepon'
    };
    return typeLabels[type];
  };

  const elementCount = (template.elements || []).filter(e => e.type === type).length + 1;

  const newElement = {
    type,
    label: `${getElementTypeLabel(type)} ${elementCount}`,
    placeholder: '',
    required: false,
    options: defaultOptions,
    template_id: template.id,
    default_value: null,
    validation_pattern: null,
    validation_message: null,
    file_accept: null,
    order: (template.elements || []).length + 1,
  };

  try {
    const createdElement = await formService.createFormElement(newElement);
    console.log('Created form element:', createdElement);

    // ✅ Tambahkan ke state tanpa memicu reload
    setTemplate(prev => ({
      ...prev,
      elements: [...(prev.elements || []), createdElement],
    }));

    setShowElementSelector(false);
    setEditingElement(createdElement);
    setIsEditorOpen(true);
  } catch (err) {
    toast({
      title: 'Error',
      description: err instanceof Error ? err.message : 'Failed to add element',
      variant: 'destructive',
    });
  }
};


  const handleEditElement = async (element: FormElement) => {
    setEditingElement(element);
    setIsEditorOpen(true);
  };

  const handleSaveElement = async (updatedElement: FormElement) => {
    try {
      console.log('Saving form element:', {
        id: updatedElement.id,
        template_id: template.id,
        type: updatedElement.type,
        label: updatedElement.label
      });

      const elementToUpdate = {
        ...updatedElement,
        template_id: template.id // Ensure template_id is included
      };

      const savedElement = await formService.updateFormElement(updatedElement.id, elementToUpdate);
      setTemplate(prev => ({
        ...prev,
        elements: (prev.elements || []).map((elem) =>
          elem.id === savedElement.id ? savedElement : elem
        ),
      }));
      setIsEditorOpen(false);
      setEditingElement(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save element';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteElement = async (elementId: string) => {
    console.log('handleDeleteElement called with ID:', elementId);
    try {
      // Show confirmation dialog
      const confirmed = window.confirm('Apakah Anda yakin ingin menghapus elemen ini?');
      console.log('Delete confirmation:', confirmed);

      if (!confirmed) {
        console.log('Delete cancelled by user');
        return;
      }

      console.log('Sending delete request for element:', elementId);
      // Delete from server first
      await formService.deleteFormElement(elementId);
      console.log('Element deleted from server successfully');

      // Then update local state
      setTemplate(prevTemplate => {
        const updatedElements = (prevTemplate.elements || []).filter((elem) => {
          console.log('Checking element:', elem.id, 'against:', elementId);
          return elem.id !== elementId;
        });
        console.log('Updated elements length:', updatedElements.length);
        return {
          ...prevTemplate,
          elements: updatedElements,
        };
      });

      toast({
        title: 'Berhasil',
        description: 'Elemen form berhasil dihapus',
      });
    } catch (err) {
      console.error('Error deleting element:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete element';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    // Debug log untuk event drag
    console.log('Debug - Drag end event:', { 
      activeId: active?.id, 
      activeData: active?.data?.current,
      overId: over?.id,
      overData: over?.data?.current,
      rawEvent: event
    });

    if (!over) {
      console.warn('Drag ended without a target (over is null) - ignoring event');
      return;
    }

    if (!active?.id) {
      console.error('Active element has no ID - ignoring event');
      return;
    }

    if (active.id === over.id) {
      console.log('Element dropped in same position - no reordering needed');
      return;
    }

    // Store reference to original elements
    const originalElements = (template.elements || []).filter(element => element.id);
    
    try {
      // Debug log untuk elements sebelum reorder
      console.log('Debug - Elements before reorder:', originalElements.map(e => ({
        id: e.id,
        label: e.label,
        order: e.order
      })));

      // Convert IDs to strings for comparison
      const activeId = String(active.id);
      const overId = String(over.id);

      if (!activeId || !overId) {
        console.error('Invalid element IDs:', { activeId, overId });
        return;
      }

      // Find indices using exact string comparison
      const oldIndex = originalElements.findIndex(item => String(item.id) === activeId);
      const newIndex = originalElements.findIndex(item => String(item.id) === overId);

      // Log more details about the indices
      console.log('Index lookup details:', {
        activeId,
        overId,
        oldIndex,
        newIndex,
        elementIds: originalElements.map(e => String(e.id))
      });

      // Validate indices
      if (oldIndex === -1 || newIndex === -1) {
        console.error('Invalid indices found:', { 
          oldIndex, 
          newIndex, 
          activeId, 
          overId,
          elementsCount: originalElements.length,
          elementIds: originalElements.map(e => ({
            id: String(e.id),
            label: e.label
          }))
        });
        return;
      }

      const reorderedElements = arrayMove(originalElements, oldIndex, newIndex);

      // Debug log untuk elements setelah reorder
      console.log('Debug - Elements after reorder:', reorderedElements.map(e => ({
        id: e.id,
        label: e.label,
        order: e.order
      })));

      // Update local state first for immediate UI feedback
      setTemplate({
        ...template,
        elements: reorderedElements,
      });

      // Prepare data for server update - just send array of IDs in new order
      const elementIds = reorderedElements.map(element => String(element.id));

      // Debug log untuk data yang akan dikirim ke server
      console.log('Sending reorder request:', {
        templateId: template.id,
        elementIds
      });

      await formService.reorderFormElements(template.id, elementIds);
      
      toast({
        title: 'Berhasil',
        description: 'Urutan elemen form telah diperbarui',
      });
      } catch (err) {
      console.error('Error during reorder:', err);
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengubah urutan elemen';
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });

      // Revert to original order on error
        setTemplate({
          ...template,
        elements: originalElements,
        });
    }
  };

  const handleSaveTemplate = async () => {
    if (!template.name.trim()) {
      toast({
        title: 'Error',
        description: 'Nama template tidak boleh kosong',
        variant: 'destructive',
      });
      return;
    }

    try {
      if (id && id !== 'new') {
        // Only send the minimal required fields for update
        const updateData = {
          id: id,
          name: template.name || '',
          description: template.description || '',
          category_id: template.category_id || '',
        };
        console.log('FormBuilder sending update data:', updateData);
        await updateFormTemplate(updateData);
      } else {
        // For new template, include only required fields
        const newTemplateData = {
          name: template.name || '',
          description: template.description || '',
          category_id: template.category_id || '',
        };
        await addFormTemplate(newTemplateData);
      }

      navigate('/admin/form-management');
      toast({
        title: 'Berhasil',
        description: `Template form "${template.name}" telah disimpan`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save template';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{id === 'new' ? 'Buat Template Form Baru' : 'Edit Template Form'}</h1>
          <p className="text-gray-500">Rancang form dengan drag & drop elemen</p>
        </div>
        <Button onClick={handleSaveTemplate}>
          <Save className="w-4 h-4 mr-2" />
          Simpan Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Properti Template</CardTitle>
              <CardDescription>
                Informasi dasar tentang template form ini
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="templateName">Nama Template</Label>
                <Input
                  id="templateName"
                  value={template.name ?? ''}
                  onChange={(e) => {
                    console.log('Setting name to:', e.target.value);
                    setTemplate(prev => ({
                      ...prev,
                      name: e.target.value
                    }));
                  }}
                  placeholder="Masukkan nama template"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="templateDescription">Deskripsi</Label>
                <Textarea
                  id="templateDescription"
                  value={template.description ?? ''}
                  onChange={(e) => {
                    console.log('Setting description to:', e.target.value);
                    setTemplate(prev => ({
                      ...prev,
                      description: e.target.value
                    }));
                  }}
                  placeholder="Masukkan deskripsi template"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Elemen Form</CardTitle>
              <CardDescription>
                Tambah dan atur elemen form sesuai kebutuhan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={(template.elements || [])
                    .filter(e => e.id)
                    .map(e => e.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {(template.elements || [])
                      .map((element) => {
                        
                        return (
                      <SortableFormElement
                        key={element.id}
                        element={element}
                        onEdit={() => handleEditElement(element)}
                            onDelete={() => handleDeleteElement(element.id)}
                            onClick={() => console.log('Rendering form element:', {
                              id: element.id,
                              type: element.type,
                              label: element.label
                            })}
                      />
                        );
                    })}
                  </div>
                </SortableContext>
              </DndContext>

              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => setShowElementSelector(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Elemen
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1">
          <ElementTypeSelector
            show={showElementSelector}
            onClose={() => setShowElementSelector(false)}
            onSelectType={handleAddElement}
          />

          <FormElementEditor
            isOpen={isEditorOpen}
            element={editingElement}
            onClose={() => {
              setIsEditorOpen(false);
              setEditingElement(null);
            }}
            onSave={handleSaveElement}
          />
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
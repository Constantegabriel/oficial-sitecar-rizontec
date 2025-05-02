
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ChangeEvent, useState } from "react";
import { useCars } from "@/contexts/CarContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Car } from "@/types";
import { Trash2, Upload } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from '@supabase/supabase-js';
import { toast } from "@/components/ui/sonner";
import { DialogTitle } from "@/components/ui/dialog";

export default function NewCarPage() {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    price: 0,
    km: 0,
    color: "",
    description: "",
    images: ["", "", ""], // Up to 3 images (URLs or file data)
    featured: false
  });
  
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { addCar } = useCars();
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize Supabase client with proper validation
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  
  // Create supabase client only if both URL and key are provided
  const supabase = (supabaseUrl && supabaseKey && supabaseUrl !== 'https://your-project.supabase.co' && supabaseKey !== 'your-anon-key') 
    ? createClient(supabaseUrl, supabaseKey)
    : null;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    
    setFormData({
      ...formData,
      images: newImages
    });
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Update the file list
    const newFiles = [...imageFiles];
    newFiles[index] = file;
    setImageFiles(newFiles);
    
    // Create a preview URL
    const imageUrl = URL.createObjectURL(file);
    handleImageChange(index, imageUrl);
  };

  const removeImage = (index: number) => {
    // Clear the image slot
    const newImages = [...formData.images];
    newImages[index] = "";
    setFormData({ ...formData, images: newImages });

    // Clear the file reference
    const newFiles = [...imageFiles];
    if (newFiles[index]) {
      URL.revokeObjectURL(formData.images[index]); // Clean up the object URL
      newFiles[index] = null as unknown as File;
      setImageFiles(newFiles);
    }
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      featured: checked
    });
  };

  const uploadToSupabase = async (files: File[]) => {
    const validFiles = files.filter(file => file !== null && file !== undefined);
    if (validFiles.length === 0) return [];
    
    // Skip uploading if Supabase client isn't initialized
    if (!supabase) {
      console.log("Supabase not initialized, skipping file upload");
      return [];
    }

    setIsUploading(true);
    const imageUrls: string[] = [];

    try {
      // Check if bucket exists, create if it doesn't
      const { data: buckets } = await supabase.storage.listBuckets();
      const carsBucketExists = buckets?.some(bucket => bucket.name === 'cars');
      
      if (!carsBucketExists) {
        const { data: newBucket, error: bucketError } = await supabase.storage.createBucket('cars', {
          public: true,
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
          fileSizeLimit: 5242880, // 5MB
        });
        
        if (bucketError) {
          console.error("Error creating bucket:", bucketError);
          toast("Erro ao criar bucket de armazenamento", {
            description: bucketError.message
          });
        }
      }

      for (const file of validFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        const filePath = `car-images/${fileName}`;

        const { data, error } = await supabase
          .storage
          .from('cars')
          .upload(filePath, file);

        if (error) {
          console.error('Upload error for file:', file.name, error);
          toast("Erro ao fazer upload", {
            description: `Erro ao enviar ${file.name}: ${error.message}`
          });
          continue;
        }

        // Get public URL of the uploaded file
        const { data: publicUrlData } = supabase
          .storage
          .from('cars')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          imageUrls.push(publicUrlData.publicUrl);
        }
      }
      return imageUrls;
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast("Erro ao enviar imagens", {
        description: error.message || "Ocorreu um erro ao enviar as imagens"
      });
      return [];
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let imagesToSave = formData.images.filter(img => img.trim() !== '');
      
      // If we have physical files to upload, do that first
      if (imageFiles.some(file => file !== null && file !== undefined)) {
        const uploadedUrls = await uploadToSupabase(imageFiles);
        if (uploadedUrls.length > 0) {
          // Replace any local file URLs with the uploaded ones
          imagesToSave = uploadedUrls;
        }
      }
      
      // Create car object
      const carData = {
        ...formData,
        images: imagesToSave
      };
      
      // Add the car with the proper type to satisfy TypeScript
      await addCar(carData as Omit<Car, 'id' | 'createdAt' | 'updatedAt' | 'status'>);
      
      toast("Carro adicionado com sucesso", {
        description: "O carro foi adicionado ao inventário"
      });
      
      // Navigate back to inventory
      navigate("/dashboard/estoque");
    } catch (error: any) {
      toast("Erro ao adicionar carro", {
        description: error.message || "Ocorreu um erro ao adicionar o carro"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollArea className="h-full overflow-auto">
      <div className="space-y-6 pb-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Adicionar Novo Anúncio</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <Input 
                  id="brand" 
                  name="brand" 
                  placeholder="Ex: Toyota" 
                  value={formData.brand}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Modelo</Label>
                <Input 
                  id="model" 
                  name="model" 
                  placeholder="Ex: Corolla" 
                  value={formData.model}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Ano</Label>
                  <Input 
                    id="year" 
                    name="year" 
                    type="number" 
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    placeholder="Ex: 2022" 
                    value={formData.year}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="color">Cor</Label>
                  <Input 
                    id="color" 
                    name="color" 
                    placeholder="Ex: Preto" 
                    value={formData.color}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input 
                    id="price" 
                    name="price" 
                    type="number"
                    min="0" 
                    step="0.01"
                    placeholder="Ex: 90000" 
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="km">Quilometragem</Label>
                  <Input 
                    id="km" 
                    name="km" 
                    type="number"
                    min="0" 
                    placeholder="Ex: 15000" 
                    value={formData.km}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="featured">Destacar anúncio</Label>
              </div>
            </div>
            
            {/* Description and Images */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Descreva o veículo, seus opcionais e características..." 
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Imagens</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Adicione até 3 imagens para o carro
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="space-y-2">
                      {formData.images[index] ? (
                        <div className="relative">
                          <img 
                            src={formData.images[index]} 
                            alt={`Imagem ${index + 1}`} 
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={() => removeImage(index)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-border rounded-md h-32 flex flex-col items-center justify-center">
                          <label
                            htmlFor={`image-upload-${index}`}
                            className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                          >
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-xs text-muted-foreground">Carregar imagem</span>
                            <input
                              id={`image-upload-${index}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, index)}
                            />
                          </label>
                        </div>
                      )}
                      <Input 
                        placeholder="Ou informe uma URL..."
                        value={formData.images[index]}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate("/dashboard/estoque")}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting || isUploading ? "Salvando..." : "Salvar Anúncio"}
            </Button>
          </div>
        </form>
      </div>
    </ScrollArea>
  );
}

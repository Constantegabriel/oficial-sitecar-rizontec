
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
import { Trash2, Upload, Images } from "lucide-react";
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
    images: ["", "", "", "", ""], // Aumentado para 5 imagens
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

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    
    // Add new files to the existing files array
    const newFiles = [...imageFiles];
    const newImages = [...formData.images];
    
    // Process each file
    files.forEach((file, idx) => {
      // Find the next empty slot or use the last position
      const emptyIndex = newImages.findIndex(img => img === "");
      const targetIndex = emptyIndex >= 0 ? emptyIndex : newImages.length;
      
      if (targetIndex < 5) { // Limit to 5 images
        // Create a preview URL
        const imageUrl = URL.createObjectURL(file);
        
        // Update files and images arrays
        newFiles[targetIndex] = file;
        newImages[targetIndex] = imageUrl;
      }
    });
    
    // Update state
    setImageFiles(newFiles);
    setFormData({
      ...formData,
      images: newImages.slice(0, 5) // Ensure we only keep 5 images
    });
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
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Imagens (máximo 5)</Label>
                  <p className="text-xs text-muted-foreground">
                    {formData.images.filter(img => img !== "").length}/5 imagens
                  </p>
                </div>
                
                {/* Área de upload unificada */}
                <div className="border-2 border-dashed border-border rounded-md p-4">
                  <div className="flex flex-col items-center justify-center">
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer w-full h-32 flex flex-col items-center justify-center"
                    >
                      <Images className="h-12 w-12 text-muted-foreground mb-2" />
                      <span className="text-sm text-center text-muted-foreground mb-2">
                        Arraste suas imagens ou clique para selecionar
                      </span>
                      <Button type="button" variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Selecionar Imagens
                      </Button>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </div>
                
                {/* Exibição das imagens selecionadas */}
                {formData.images.some(img => img !== "") && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-3">
                    {formData.images.map((image, idx) => 
                      image && (
                        <div key={idx} className="relative">
                          <img 
                            src={image} 
                            alt={`Imagem ${idx + 1}`} 
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => removeImage(idx)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground mt-2">
                  Formatos aceitos: JPG, PNG, GIF, WEBP. Tamanho máximo: 5MB por imagem.
                </p>
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

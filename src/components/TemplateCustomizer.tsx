import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Template } from '@/contexts/TemplateContext';
import { Palette, Type, Image, Save, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomizationData {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  fontFamily?: string;
  logoPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  customImages?: { [key: string]: string };
  customTexts?: { [key: string]: string };
}

interface TemplateCustomizerProps {
  template: Template;
  brandSettings?: {
    logo_url?: string;
    primary_color: string;
    secondary_color: string;
    font_family: string;
  };
  onSave?: (customizationData: CustomizationData) => void;
  onPreview?: (customizationData: CustomizationData) => void;
}

const TemplateCustomizer: React.FC<TemplateCustomizerProps> = ({
  template,
  brandSettings,
  onSave,
  onPreview
}) => {
  const [customization, setCustomization] = useState<CustomizationData>({
    backgroundColor: brandSettings?.primary_color || '#8B5CF6',
    textColor: '#FFFFFF',
    fontSize: '16px',
    fontFamily: brandSettings?.font_family || 'Inter',
    logoPosition: 'top-right',
    customImages: {},
    customTexts: {}
  });

  const { toast } = useToast();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const fontSizeOptions = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px'];
  const logoPositions = [
    { value: 'top-left', label: 'Superior Esquerdo' },
    { value: 'top-right', label: 'Superior Direito' },
    { value: 'bottom-left', label: 'Inferior Esquerdo' },
    { value: 'bottom-right', label: 'Inferior Direito' },
    { value: 'center', label: 'Centro' }
  ];

  const handleCustomizationChange = (key: keyof CustomizationData, value: any) => {
    setCustomization(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTextChange = (elementIndex: number, value: string) => {
    setCustomization(prev => ({
      ...prev,
      customTexts: {
        ...prev.customTexts,
        [elementIndex]: value
      }
    }));
  };

  const handleImageUpload = async (elementIndex: number, file: File) => {
    try {
      // Simular upload de imagem (aqui você integraria com Supabase Storage)
      const imageUrl = URL.createObjectURL(file);
      setCustomization(prev => ({
        ...prev,
        customImages: {
          ...prev.customImages,
          [elementIndex]: imageUrl
        }
      }));
      
      toast({
        title: "Imagem carregada!",
        description: "A imagem foi adicionada ao template."
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Não foi possível carregar a imagem.",
        variant: "destructive"
      });
    }
  };

  const handleSave = () => {
    onSave?.(customization);
    toast({
      title: "Template personalizado salvo!",
      description: "Suas customizações foram aplicadas com sucesso."
    });
  };

  const handlePreview = () => {
    onPreview?.(customization);
  };

  return (
    <div className="space-y-6">
      {/* Template Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Personalizar: {template.title}</span>
            <Badge variant={template.premium ? "default" : "secondary"}>
              {template.platform}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{template.description}</p>
        </CardContent>
      </Card>

      {/* Style Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Cores e Estilo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bg-color">Cor de Fundo</Label>
              <div className="flex items-center gap-2">
                <input
                  id="bg-color"
                  type="color"
                  value={customization.backgroundColor}
                  onChange={(e) => handleCustomizationChange('backgroundColor', e.target.value)}
                  className="w-12 h-10 border border-border rounded cursor-pointer"
                />
                <Input
                  value={customization.backgroundColor}
                  onChange={(e) => handleCustomizationChange('backgroundColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="text-color">Cor do Texto</Label>
              <div className="flex items-center gap-2">
                <input
                  id="text-color"
                  type="color"
                  value={customization.textColor}
                  onChange={(e) => handleCustomizationChange('textColor', e.target.value)}
                  className="w-12 h-10 border border-border rounded cursor-pointer"
                />
                <Input
                  value={customization.textColor}
                  onChange={(e) => handleCustomizationChange('textColor', e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Tipografia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="font-family">Fonte</Label>
              <select
                id="font-family"
                value={customization.fontFamily}
                onChange={(e) => handleCustomizationChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Poppins">Poppins</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Playfair Display">Playfair Display</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="font-size">Tamanho da Fonte</Label>
              <select
                id="font-size"
                value={customization.fontSize}
                onChange={(e) => handleCustomizationChange('fontSize', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md"
              >
                {fontSizeOptions.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logo Positioning */}
      {brandSettings?.logo_url && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Posicionamento do Logo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="logo-position">Posição do Logo</Label>
              <select
                id="logo-position"
                value={customization.logoPosition}
                onChange={(e) => handleCustomizationChange('logoPosition', e.target.value)}
                className="w-full px-3 py-2 bg-background border border-border rounded-md"
              >
                {logoPositions.map(position => (
                  <option key={position.value} value={position.value}>
                    {position.label}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Customization */}
      <Card>
        <CardHeader>
          <CardTitle>Conteúdo do Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {template.contentStructure?.elements.map((element, index) => (
            <div key={index} className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Elemento {index + 1}: {element.type}
                </Label>
                <Badge variant="outline">{element.type}</Badge>
              </div>
              
              {element.type === 'text' && (
                <Textarea
                  placeholder={element.placeholder}
                  value={customization.customTexts?.[index] || ''}
                  onChange={(e) => handleTextChange(index, e.target.value)}
                  className="min-h-[80px]"
                />
              )}
              
              {element.type === 'image' && (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => { fileInputRefs.current[index] = el; }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(index, file);
                    }}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRefs.current[index]?.click()}
                    variant="outline"
                    className="w-full"
                  >
                    <Image className="h-4 w-4 mr-2" />
                    {customization.customImages?.[index] ? 'Alterar Imagem' : 'Adicionar Imagem'}
                  </Button>
                  {customization.customImages?.[index] && (
                    <div className="w-full h-32 border border-border rounded overflow-hidden">
                      <img
                        src={customization.customImages[index]}
                        alt={`Custom ${index}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Preview and Save */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Button onClick={handlePreview} variant="outline" className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </Button>
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Salvar Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Area */}
      <Card>
        <CardHeader>
          <CardTitle>Prévia do Template</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="relative w-full aspect-square border border-border rounded-lg overflow-hidden"
            style={{ 
              backgroundColor: customization.backgroundColor,
              fontFamily: customization.fontFamily
            }}
          >
            {/* Logo positioning */}
            {brandSettings?.logo_url && (
              <div 
                className={`absolute w-16 h-16 ${
                  customization.logoPosition === 'top-left' ? 'top-4 left-4' :
                  customization.logoPosition === 'top-right' ? 'top-4 right-4' :
                  customization.logoPosition === 'bottom-left' ? 'bottom-4 left-4' :
                  customization.logoPosition === 'bottom-right' ? 'bottom-4 right-4' :
                  'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
                }`}
              >
                <img
                  src={brandSettings.logo_url}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            
            {/* Content preview */}
            <div className="p-6 h-full flex flex-col justify-center items-center text-center">
              <h3 
                className="text-xl font-bold mb-2"
                style={{ 
                  color: customization.textColor,
                  fontSize: customization.fontSize 
                }}
              >
                {customization.customTexts?.[0] || 'Seu conteúdo aqui'}
              </h3>
              <p 
                className="text-sm opacity-80"
                style={{ color: customization.textColor }}
              >
                Template personalizado para {template.platform}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateCustomizer;
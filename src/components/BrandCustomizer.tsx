import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Palette, Type, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BrandSettings {
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
}

interface BrandCustomizerProps {
  settings: BrandSettings;
  onSettingsChange: (settings: BrandSettings) => void;
  userId?: string;
}

const BrandCustomizer: React.FC<BrandCustomizerProps> = ({
  settings,
  onSettingsChange,
  userId
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fontOptions = [
    'Inter',
    'Roboto',
    'Poppins',
    'Montserrat',
    'Open Sans',
    'Playfair Display',
    'Oswald',
    'Raleway'
  ];

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/logo.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName);

      onSettingsChange({
        ...settings,
        logo_url: data.publicUrl
      });

      toast({
        title: "Logo carregado com sucesso!",
        description: "Seu logo foi salvo e será aplicado aos templates."
      });
    } catch (error) {
      console.error('Erro ao fazer upload do logo:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível carregar o logo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleColorChange = (colorType: 'primary_color' | 'secondary_color', value: string) => {
    onSettingsChange({
      ...settings,
      [colorType]: value
    });
  };

  return (
    <div className="space-y-6">
      {/* Logo Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Logo da Marca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {settings.logo_url && (
              <div className="w-16 h-16 border border-border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                <img
                  src={settings.logo_url}
                  alt="Logo atual"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || !userId}
                variant="outline"
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Carregando...' : 'Carregar Logo'}
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Recomendado: PNG ou SVG, fundo transparente
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Customization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Cores da Marca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Cor Primária</Label>
              <div className="flex items-center gap-2">
                <input
                  id="primary-color"
                  type="color"
                  value={settings.primary_color}
                  onChange={(e) => handleColorChange('primary_color', e.target.value)}
                  className="w-12 h-10 border border-border rounded cursor-pointer"
                />
                <Input
                  value={settings.primary_color}
                  onChange={(e) => handleColorChange('primary_color', e.target.value)}
                  placeholder="#8B5CF6"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondary-color">Cor Secundária</Label>
              <div className="flex items-center gap-2">
                <input
                  id="secondary-color"
                  type="color"
                  value={settings.secondary_color}
                  onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                  className="w-12 h-10 border border-border rounded cursor-pointer"
                />
                <Input
                  value={settings.secondary_color}
                  onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                  placeholder="#EC4899"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Font Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Fonte da Marca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="font-family">Família da Fonte</Label>
            <select
              id="font-family"
              value={settings.font_family}
              onChange={(e) => onSettingsChange({ ...settings, font_family: e.target.value })}
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {fontOptions.map(font => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
            <p className="text-sm text-muted-foreground mt-2" style={{ fontFamily: settings.font_family }}>
              Prévia da fonte: O seu conteúdo será exibido assim
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Prévia da Marca</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="p-6 rounded-lg border-2 border-dashed"
            style={{ 
              borderColor: settings.primary_color,
              backgroundColor: `${settings.primary_color}10`
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              {settings.logo_url && (
                <img
                  src={settings.logo_url}
                  alt="Logo"
                  className="w-12 h-12 object-contain"
                />
              )}
              <div>
                <h3 
                  className="text-xl font-bold"
                  style={{ 
                    color: settings.primary_color,
                    fontFamily: settings.font_family 
                  }}
                >
                  Sua Marca
                </h3>
                <p 
                  className="text-sm"
                  style={{ 
                    color: settings.secondary_color,
                    fontFamily: settings.font_family 
                  }}
                >
                  Conteúdo personalizado
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandCustomizer;
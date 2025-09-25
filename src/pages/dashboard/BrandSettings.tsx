import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import BrandCustomizer from '@/components/BrandCustomizer';
import { useBrandSettings } from '@/hooks/useBrandSettings';
import { supabase } from '@/integrations/supabase/client';
import { Palette, Settings, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BrandSettings = () => {
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  
  const {
    settings,
    setSettings,
    saveSettings,
    loading
  } = useBrandSettings(user?.id);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSettingsChange = (newSettings: any) => {
    setSettings(newSettings);
  };

  const handleSave = async () => {
    const success = await saveSettings(settings);
    if (success) {
      toast({
        title: "Configurações salvas!",
        description: "Suas configurações de marca foram atualizadas com sucesso."
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground">
                Faça login para acessar as configurações de marca
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações de Marca</h1>
          <p className="text-muted-foreground">
            Personalize seu logo, cores e fontes para todos os templates
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Personalização
        </Badge>
      </div>

      <Separator />

      {/* Brand Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BrandCustomizer
            settings={settings}
            onSettingsChange={handleSettingsChange}
            userId={user?.id}
          />
        </div>

        {/* Sidebar with Tips */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Dicas de Branding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Logo</h4>
                <p className="text-sm text-muted-foreground">
                  Use arquivos PNG ou SVG com fundo transparente para melhor resultado.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Cores</h4>
                <p className="text-sm text-muted-foreground">
                  Escolha cores que representem sua marca e tenham bom contraste.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Fontes</h4>
                <p className="text-sm text-muted-foreground">
                  Selecione fontes legíveis que combinem com o estilo da sua marca.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status das Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Logo</span>
                <Badge variant={settings.logo_url ? "default" : "secondary"}>
                  {settings.logo_url ? "Configurado" : "Pendente"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cores</span>
                <Badge variant="default">Configurado</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Fonte</span>
                <Badge variant="default">Configurado</Badge>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="w-full"
            size="lg"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrandSettings;
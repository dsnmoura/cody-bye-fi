import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TemplateCustomizer from '@/components/TemplateCustomizer';
import { templates } from '@/data/templates';
import { useBrandSettings } from '@/hooks/useBrandSettings';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CustomizeTemplate = () => {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [template, setTemplate] = useState<any>(null);
  
  const { settings: brandSettings, loading: brandLoading } = useBrandSettings(user?.id);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (templateId) {
      const foundTemplate = templates.find(t => t.id === templateId);
      setTemplate(foundTemplate);
    }
  }, [templateId]);

  const handleSaveCustomization = async (customizationData: any) => {
    if (!user || !template) {
      toast({
        title: "Erro",
        description: "Usuário ou template não encontrado",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('customized_templates')
        .insert([
          {
            user_id: user.id,
            original_template_id: template.id,
            name: `${template.title} - Personalizado`,
            platform: template.platform,
            type: template.type,
            customization_data: customizationData
          }
        ]);

      if (error) throw error;

      toast({
        title: "Template salvo!",
        description: "Seu template personalizado foi salvo com sucesso.",
      });

      // Redirecionar para a página de templates
      navigate('/dashboard/templates');
    } catch (error) {
      console.error('Erro ao salvar template customizado:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o template personalizado.",
        variant: "destructive"
      });
    }
  };

  const handlePreview = (customizationData: any) => {
    // Implementar preview em uma modal ou nova página
    console.log('Preview customization:', customizationData);
    toast({
      title: "Preview",
      description: "Funcionalidade de preview em desenvolvimento",
    });
  };

  if (!template) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground">Template não encontrado</p>
              <Button 
                onClick={() => navigate('/dashboard/templates')} 
                variant="outline" 
                className="mt-4"
              >
                Voltar aos Templates
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-muted-foreground">
                Faça login para personalizar templates
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
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/dashboard/templates')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Personalizar Template
            </h1>
            <p className="text-muted-foreground">
              Customize cores, fontes e adicione seu logo
            </p>
          </div>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          {template.platform}
        </Badge>
      </div>

      {/* Template Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={template.image} 
                alt={template.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-xl font-semibold">{template.title}</h2>
                <p className="text-muted-foreground">{template.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{template.category}</Badge>
              {template.premium && (
                <Badge variant="default">Premium</Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Brand Settings Notice */}
      {brandSettings && !brandSettings.logo_url && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-orange-800">
                  Configure sua marca primeiro
                </h3>
                <p className="text-sm text-orange-600">
                  Adicione seu logo e cores nas configurações de marca para personalizar melhor os templates
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard/brand-settings')}
              >
                Configurar Marca
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TemplateCustomizer
            template={template}
            brandSettings={brandSettings}
            onSave={handleSaveCustomization}
            onPreview={handlePreview}
          />
        </div>

        {/* Sidebar with Brand Info */}
        <div className="space-y-6">
          {brandSettings && (
            <Card>
              <CardHeader>
                <CardTitle>Sua Marca</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {brandSettings.logo_url && (
                  <div className="flex items-center gap-3">
                    <img 
                      src={brandSettings.logo_url}
                      alt="Logo da marca"
                      className="w-12 h-12 object-contain border border-border rounded"
                    />
                    <div>
                      <p className="text-sm font-medium">Logo configurado</p>
                      <p className="text-xs text-muted-foreground">
                        Será inserido automaticamente
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Cor Primária</p>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: brandSettings.primary_color }}
                      />
                      <span className="text-sm font-mono">
                        {brandSettings.primary_color}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Cor Secundária</p>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: brandSettings.secondary_color }}
                      />
                      <span className="text-sm font-mono">
                        {brandSettings.secondary_color}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Fonte</p>
                  <p className="text-sm" style={{ fontFamily: brandSettings.font_family }}>
                    {brandSettings.font_family}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Dicas de Personalização</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Consistência Visual</h4>
                <p className="text-xs text-muted-foreground">
                  Use as cores da sua marca para manter consistência em todas as postagens.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Logo Positioning</h4>
                <p className="text-xs text-muted-foreground">
                  Posicione o logo de forma que não interfira no conteúdo principal.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Legibilidade</h4>
                <p className="text-xs text-muted-foreground">
                  Certifique-se de que o texto seja legível com as cores escolhidas.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomizeTemplate;
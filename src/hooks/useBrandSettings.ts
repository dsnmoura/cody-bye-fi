import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BrandSettings {
  id?: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
}

export const useBrandSettings = (userId?: string) => {
  const [settings, setSettings] = useState<BrandSettings>({
    primary_color: '#8B5CF6',
    secondary_color: '#EC4899',
    font_family: 'Inter'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Carregar configurações do usuário
  const loadSettings = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
      setError('Erro ao carregar configurações da marca');
    } finally {
      setLoading(false);
    }
  };

  // Salvar configurações
  const saveSettings = async (newSettings: Partial<BrandSettings>) => {
    if (!userId) {
      toast({
        title: "Erro",
        description: "Usuário não identificado",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedSettings = { ...settings, ...newSettings };

      if (settings.id) {
        // Atualizar existente
        const { error } = await supabase
          .from('brand_settings')
          .update(updatedSettings)
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        // Criar novo
        const { data, error } = await supabase
          .from('brand_settings')
          .insert([{ ...updatedSettings, user_id: userId }])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setSettings(data);
        }
      }

      setSettings(updatedSettings);
      
      toast({
        title: "Configurações salvas!",
        description: "Suas configurações de marca foram atualizadas."
      });

      return true;
    } catch (err) {
      console.error('Erro ao salvar configurações:', err);
      setError('Erro ao salvar configurações');
      
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [userId]);

  return {
    settings,
    setSettings,
    saveSettings,
    loading,
    error,
    reload: loadSettings
  };
};
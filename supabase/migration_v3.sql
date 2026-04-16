-- ============================================================
-- MIGRATION V3 — Auto-cadastro público (sem login)
-- ============================================================

-- Permite created_by nulo para registros públicos
ALTER TABLE public.contacts
  ALTER COLUMN created_by DROP NOT NULL;

-- Função pública de cadastro (SECURITY DEFINER bypassa RLS)
-- Pode ser chamada por qualquer pessoa, mesmo sem login
CREATE OR REPLACE FUNCTION public.registrar_contato_publico(
  p_nome    text,
  p_telefone text,
  p_bairro  text,
  p_igreja  text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Bloqueia telefone duplicado
  IF EXISTS (
    SELECT 1 FROM public.contacts
    WHERE regexp_replace(telefone, '\D', '', 'g') =
          regexp_replace(p_telefone, '\D', '', 'g')
  ) THEN
    RETURN json_build_object('error', 'Este telefone já está cadastrado no sistema.');
  END IF;

  INSERT INTO public.contacts (nome, telefone, bairro, igreja, created_by)
  VALUES (p_nome, p_telefone, p_bairro, p_igreja, NULL);

  RETURN json_build_object('success', true);
END;
$$;

-- Libera execução para usuários não autenticados (anon) e autenticados
GRANT EXECUTE ON FUNCTION public.registrar_contato_publico TO anon;
GRANT EXECUTE ON FUNCTION public.registrar_contato_publico TO authenticated;

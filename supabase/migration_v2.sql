-- ============================================================
-- MIGRATION V2
-- 1. Unicidade de telefone (sem duplicatas no sistema)
-- 2. View para ranking de membros
-- ============================================================

-- Impede cadastro de telefone duplicado em toda a base
ALTER TABLE public.contacts
  ADD CONSTRAINT contacts_telefone_unique UNIQUE (telefone);

-- View: ranking top membros por quantidade de contatos cadastrados
CREATE OR REPLACE VIEW public.ranking_members AS
SELECT
  p.id,
  p.name,
  COUNT(c.id)::int AS total
FROM public.profiles p
LEFT JOIN public.contacts c ON c.created_by = p.id
WHERE p.role = 'member'
GROUP BY p.id, p.name
ORDER BY total DESC;

GRANT SELECT ON public.ranking_members TO authenticated;

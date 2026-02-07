-- Migration : Historique & Glossaire
-- Date : 2026-02-07

-- ============================================
-- 1. ENRICHISSEMENT TABLE CORRECTIONS
-- ============================================

-- Ajouter des colonnes pour l'historique enrichi
ALTER TABLE corrections 
ADD COLUMN IF NOT EXISTS document_type TEXT DEFAULT 'other',
ADD COLUMN IF NOT EXISTS title TEXT,
ADD COLUMN IF NOT EXISTS error_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS auto_delete_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS mode TEXT DEFAULT 'standard';

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_corrections_user_created 
ON corrections(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_corrections_auto_delete 
ON corrections(auto_delete_at) 
WHERE auto_delete_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_corrections_document_type 
ON corrections(user_id, document_type);

-- ============================================
-- 2. TABLE GLOSSAIRE
-- ============================================

CREATE TABLE IF NOT EXISTS glossary_terms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  term TEXT NOT NULL,
  category TEXT DEFAULT 'other', -- 'name', 'acronym', 'technical', 'other'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, LOWER(term))
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_glossary_user 
ON glossary_terms(user_id);

CREATE INDEX IF NOT EXISTS idx_glossary_term 
ON glossary_terms(user_id, LOWER(term));

-- ============================================
-- 3. TABLE ABONNEMENTS (STRIPE)
-- ============================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL, -- 'free', 'pro', 'team'
  status TEXT NOT NULL, -- 'active', 'canceled', 'past_due', 'trialing'
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  trial_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user 
ON subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer 
ON subscriptions(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_status 
ON subscriptions(status);

-- ============================================
-- 4. RPC FUNCTIONS
-- ============================================

-- Fonction : Obtenir le quota restant (enrichie avec plan)
CREATE OR REPLACE FUNCTION get_remaining_corrections(p_user_id UUID)
RETURNS TABLE(remaining INT, limit_today INT, plan TEXT) AS $$
DECLARE
  v_count INT;
  v_limit INT;
  v_plan TEXT;
BEGIN
  -- Récupérer le plan de l'utilisateur
  SELECT COALESCE(s.plan, 'free') INTO v_plan
  FROM subscriptions s
  WHERE s.user_id = p_user_id 
    AND s.status IN ('active', 'trialing')
  LIMIT 1;
  
  -- Si pas d'abonnement, plan = 'free'
  IF v_plan IS NULL THEN
    v_plan := 'free';
  END IF;
  
  -- Définir la limite selon le plan
  IF v_plan = 'pro' OR v_plan = 'team' THEN
    v_limit := 999999; -- Illimité
  ELSE
    v_limit := 50; -- Gratuit
  END IF;
  
  -- Compter les corrections du jour
  SELECT COUNT(*) INTO v_count
  FROM corrections
  WHERE user_id = p_user_id
    AND created_at >= CURRENT_DATE;
  
  RETURN QUERY SELECT (v_limit - v_count)::INT, v_limit, v_plan;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction : Obtenir le glossaire de l'utilisateur
CREATE OR REPLACE FUNCTION get_user_glossary(p_user_id UUID)
RETURNS TABLE(term TEXT) AS $$
BEGIN
  RETURN QUERY 
  SELECT g.term
  FROM glossary_terms g
  WHERE g.user_id = p_user_id
  ORDER BY g.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction : Vérifier la limite du glossaire
CREATE OR REPLACE FUNCTION check_glossary_limit(p_user_id UUID)
RETURNS TABLE(count INT, limit_reached BOOLEAN, plan TEXT) AS $$
DECLARE
  v_count INT;
  v_plan TEXT;
  v_limit INT;
BEGIN
  -- Récupérer le plan
  SELECT COALESCE(s.plan, 'free') INTO v_plan
  FROM subscriptions s
  WHERE s.user_id = p_user_id 
    AND s.status IN ('active', 'trialing')
  LIMIT 1;
  
  IF v_plan IS NULL THEN
    v_plan := 'free';
  END IF;
  
  -- Définir la limite
  IF v_plan = 'pro' OR v_plan = 'team' THEN
    v_limit := 999999; -- Illimité
  ELSE
    v_limit := 10; -- Gratuit : 10 termes max
  END IF;
  
  -- Compter les termes
  SELECT COUNT(*) INTO v_count
  FROM glossary_terms
  WHERE user_id = p_user_id;
  
  RETURN QUERY SELECT v_count::INT, (v_count >= v_limit), v_plan;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction : Nettoyer les corrections expirées (auto_delete)
CREATE OR REPLACE FUNCTION cleanup_expired_corrections()
RETURNS INT AS $$
DECLARE
  v_deleted INT;
BEGIN
  DELETE FROM corrections
  WHERE auto_delete_at IS NOT NULL
    AND auto_delete_at < NOW();
  
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS sur glossary_terms
ALTER TABLE glossary_terms ENABLE ROW LEVEL SECURITY;

-- Policy : Les utilisateurs ne voient que leurs propres termes
CREATE POLICY glossary_user_policy ON glossary_terms
  FOR ALL
  USING (auth.uid() = user_id);

-- Activer RLS sur subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy : Les utilisateurs ne voient que leur propre abonnement
CREATE POLICY subscriptions_user_policy ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- 6. TRIGGERS
-- ============================================

-- Trigger : Mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_glossary_terms_updated_at
  BEFORE UPDATE ON glossary_terms
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. COMMENTAIRES
-- ============================================

COMMENT ON TABLE glossary_terms IS 'Termes protégés par utilisateur (noms propres, acronymes, jargon)';
COMMENT ON TABLE subscriptions IS 'Abonnements Stripe des utilisateurs';
COMMENT ON COLUMN corrections.document_type IS 'Type de document : email, report, message, other';
COMMENT ON COLUMN corrections.title IS 'Titre optionnel du document';
COMMENT ON COLUMN corrections.error_count IS 'Nombre d''erreurs détectées';
COMMENT ON COLUMN corrections.auto_delete_at IS 'Date de suppression automatique (Pro uniquement)';
COMMENT ON COLUMN corrections.mode IS 'Mode de correction utilisé';

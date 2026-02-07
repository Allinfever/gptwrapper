// Types pour l'historique, le glossaire et les abonnements

// ============================================
// HISTORIQUE
// ============================================

export type DocumentType = 'email' | 'report' | 'message' | 'candidature' | 'other';

export interface HistoryItem {
    id: string;
    user_id: string;
    title?: string;
    document_type: DocumentType;
    original_text: string;
    corrected_text: string;
    error_count: number;
    mode: CorrectionMode;
    created_at: string;
    auto_delete_at?: string;
}

export interface HistoryFilters {
    document_type?: DocumentType;
    date_from?: string;
    date_to?: string;
    search?: string;
}

export interface HistoryStats {
    total_corrections: number;
    total_errors_fixed: number;
    most_used_mode: CorrectionMode;
    most_common_document_type: DocumentType;
    average_errors_per_correction: number;
}

// ============================================
// GLOSSAIRE
// ============================================

export type GlossaryCategory = 'name' | 'acronym' | 'technical' | 'other';

export interface GlossaryTerm {
    id: string;
    user_id: string;
    term: string;
    category: GlossaryCategory;
    created_at: string;
    updated_at: string;
}

export interface GlossaryLimits {
    count: number;
    limit: number;
    limit_reached: boolean;
    plan: SubscriptionPlan;
}

export interface AddGlossaryTermRequest {
    term: string;
    category?: GlossaryCategory;
}

// ============================================
// ABONNEMENTS
// ============================================

export type SubscriptionPlan = 'free' | 'pro' | 'team';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';

export interface Subscription {
    id: string;
    user_id: string;
    stripe_customer_id?: string;
    stripe_subscription_id?: string;
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    current_period_start?: string;
    current_period_end?: string;
    cancel_at_period_end: boolean;
    trial_end?: string;
    created_at: string;
    updated_at: string;
}

export interface PlanFeatures {
    corrections_per_day: number;
    history_days: number | 'unlimited';
    glossary_terms: number | 'unlimited';
    max_characters: number;
    modes: CorrectionMode[];
    export_enabled: boolean;
    priority_support: boolean;
    chrome_extension: boolean;
    auto_delete_option: boolean;
}

export const PLAN_FEATURES: Record<SubscriptionPlan, PlanFeatures> = {
    free: {
        corrections_per_day: 50,
        history_days: 7,
        glossary_terms: 10,
        max_characters: 12000,
        modes: ['typo-only', 'standard', 'strict'],
        export_enabled: false,
        priority_support: false,
        chrome_extension: false,
        auto_delete_option: false,
    },
    pro: {
        corrections_per_day: 999999, // Illimité
        history_days: 'unlimited',
        glossary_terms: 'unlimited',
        max_characters: 50000,
        modes: ['typo-only', 'standard', 'strict', 'zero-risk', 'typography-only'],
        export_enabled: true,
        priority_support: true,
        chrome_extension: true,
        auto_delete_option: true,
    },
    team: {
        corrections_per_day: 999999, // Illimité
        history_days: 'unlimited',
        glossary_terms: 'unlimited',
        max_characters: 50000,
        modes: ['typo-only', 'standard', 'strict', 'zero-risk', 'typography-only'],
        export_enabled: true,
        priority_support: true,
        chrome_extension: true,
        auto_delete_option: true,
    },
};

// ============================================
// PRICING
// ============================================

export interface PricingTier {
    plan: SubscriptionPlan;
    name: string;
    price_monthly: number;
    price_yearly?: number;
    description: string;
    features: string[];
    cta: string;
    highlighted?: boolean;
}

export const PRICING_TIERS: PricingTier[] = [
    {
        plan: 'free',
        name: 'Gratuit',
        price_monthly: 0,
        description: 'Pour découvrir Correcteur',
        features: [
            '50 corrections par jour',
            'Historique 7 jours',
            '10 termes protégés',
            'Tous les modes de base',
            '12 000 caractères/texte',
        ],
        cta: 'Commencer gratuitement',
    },
    {
        plan: 'pro',
        name: 'Pro',
        price_monthly: 9,
        price_yearly: 90, // 2 mois offerts
        description: 'Pour un usage professionnel quotidien',
        features: [
            'Corrections illimitées',
            'Historique illimité',
            'Glossaire illimité',
            'Tous les modes (5+)',
            '50 000 caractères/texte',
            'Export PDF/DOCX',
            'Extension Chrome',
            'Mode "ne rien conserver"',
            'Support prioritaire',
        ],
        cta: 'Essayer Pro (14 jours gratuits)',
        highlighted: true,
    },
    {
        plan: 'team',
        name: 'Team',
        price_monthly: 29,
        description: 'Pour les équipes (par utilisateur/mois)',
        features: [
            'Tout Pro +',
            'Glossaire partagé',
            'Dashboard équipe',
            'Gestion des membres',
            'Facturation centralisée',
            'Support dédié',
        ],
        cta: 'Contacter l\'équipe',
    },
];

// ============================================
// QUOTA (enrichi avec plan)
// ============================================

export interface QuotaInfo {
    remaining: number;
    limit: number;
    plan: SubscriptionPlan;
    is_unlimited: boolean;
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, Shield, Users, ArrowRight, Star } from 'lucide-react';
import { PRICING_TIERS } from '@/lib/types/subscription';
import type { PricingTier } from '@/lib/types/subscription';

export default function PricingPage() {
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
            {/* Header - Style Apple */}
            <header className="glass sticky top-0 z-50 border-b border-gray-200/50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                            <span className="text-white font-bold text-lg">C</span>
                        </div>
                        <span className="text-xl font-semibold text-gray-900">Correcteur</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/app" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                            Application
                        </Link>
                        <Link href="/pricing" className="text-gray-900 font-medium">
                            Tarifs
                        </Link>
                        <Link
                            href="/login"
                            className="btn btn-secondary text-sm"
                        >
                            Connexion
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
                    <Star className="w-4 h-4" />
                    <span>Essai gratuit de 14 jours</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in text-balance">
                    Un tarif simple,
                    <br />
                    <span className="gradient-text">sans surprise</span>
                </h1>

                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 animate-fade-in text-balance">
                    Choisissez l'offre qui correspond à votre usage.
                    <br />
                    Changez ou annulez à tout moment.
                </p>

                {/* Toggle Mensuel/Annuel */}
                <div className="inline-flex items-center gap-1 bg-white rounded-full p-1.5 shadow-md border border-gray-200 mb-16">
                    <button
                        onClick={() => setBillingPeriod('monthly')}
                        className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${billingPeriod === 'monthly'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Mensuel
                    </button>
                    <button
                        onClick={() => setBillingPeriod('yearly')}
                        className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${billingPeriod === 'yearly'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        Annuel
                        <span className="badge badge-success text-xs">-17%</span>
                    </button>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="max-w-7xl mx-auto px-6 pb-20">
                <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                    {PRICING_TIERS.map((tier, index) => (
                        <PricingCard
                            key={tier.plan}
                            tier={tier}
                            billingPeriod={billingPeriod}
                            index={index}
                        />
                    ))}
                </div>
            </section>

            {/* Réassurance */}
            <section className="max-w-5xl mx-auto px-6 py-16">
                <div className="card text-center">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-8">
                        Pourquoi choisir Correcteur ?
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                                <Check className="w-6 h-6 text-green-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Sans engagement</h4>
                            <p className="text-sm text-gray-600">Annulez à tout moment en un clic</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Données protégées</h4>
                            <p className="text-sm text-gray-600">Vos textes ne sont jamais réutilisés</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                                <Star className="w-6 h-6 text-purple-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900 mb-2">Essai gratuit</h4>
                            <p className="text-sm text-gray-600">14 jours pour tout tester</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="max-w-3xl mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
                    Questions fréquentes
                </h2>
                <div className="space-y-4">
                    <FAQItem
                        question="Quelle est la différence avec ChatGPT ?"
                        answer="ChatGPT reformule vos textes et change votre style. Correcteur corrige uniquement les erreurs sans jamais toucher à votre ton ou votre structure. Parfait pour les emails professionnels."
                    />
                    <FAQItem
                        question="Mes textes sont-ils stockés ?"
                        answer="Version gratuite : non, jamais. Version Pro : vous choisissez. Activez le mode 'ne rien conserver' pour supprimer automatiquement vos corrections."
                    />
                    <FAQItem
                        question="Puis-je annuler mon abonnement ?"
                        answer="Oui, à tout moment, en un clic. Aucun engagement. Vous gardez l'accès jusqu'à la fin de votre période payée."
                    />
                    <FAQItem
                        question="Comment fonctionne l'essai gratuit ?"
                        answer="14 jours complets de la version Pro, sans carte bancaire. À la fin, choisissez de souscrire ou de rester en version gratuite."
                    />
                    <FAQItem
                        question="C'est moins cher qu'Antidote ?"
                        answer="Oui ! Antidote coûte 129€/an. Correcteur Pro : 9€/mois ou 90€/an. Et contrairement à Antidote, Correcteur est 100% cloud, accessible partout."
                    />
                </div>
            </section>

            {/* CTA Final */}
            <section className="max-w-4xl mx-auto px-6 py-20">
                <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Prête à corriger sans stress ?
                    </h2>
                    <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                        Rejoignez les professionnelles qui font confiance à Correcteur pour leurs emails quotidiens.
                    </p>
                    <Link
                        href="/signup"
                        className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all hover:-translate-y-0.5"
                    >
                        Commencer gratuitement
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                    <p className="text-blue-100 text-sm mt-4">
                        Aucune carte bancaire requise
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">C</span>
                            </div>
                            <span className="text-gray-600 text-sm">© 2026 Correcteur</span>
                        </div>
                        <div className="flex items-center gap-8 text-sm">
                            <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                                Confidentialité
                            </Link>
                            <Link href="/legal" className="text-gray-600 hover:text-gray-900 transition-colors">
                                Mentions légales
                            </Link>
                            <Link href="mailto:contact@letelos.fr" className="text-gray-600 hover:text-gray-900 transition-colors">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function PricingCard({
    tier,
    billingPeriod,
    index
}: {
    tier: PricingTier;
    billingPeriod: 'monthly' | 'yearly';
    index: number;
}) {
    const Icon = tier.plan === 'free' ? Sparkles : tier.plan === 'pro' ? Shield : Users;
    const price = billingPeriod === 'yearly' && tier.price_yearly
        ? Math.round(tier.price_yearly / 12)
        : tier.price_monthly;

    const isHighlighted = tier.highlighted;

    return (
        <div
            className={`
        relative rounded-3xl p-8 transition-all duration-300
        ${isHighlighted
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl scale-105 border-2 border-blue-400'
                    : 'bg-white border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }
      `}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {isHighlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                        ⭐ Recommandé
                    </span>
                </div>
            )}

            <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-2xl ${isHighlighted ? 'bg-white/20' : 'bg-blue-50'
                    }`}>
                    <Icon className={`w-6 h-6 ${isHighlighted ? 'text-white' : 'text-blue-600'
                        }`} />
                </div>
                <h3 className={`text-2xl font-bold ${isHighlighted ? 'text-white' : 'text-gray-900'
                    }`}>
                    {tier.name}
                </h3>
            </div>

            <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                    <span className={`text-5xl font-bold ${isHighlighted ? 'text-white' : 'text-gray-900'
                        }`}>
                        {price}€
                    </span>
                    {price > 0 && (
                        <span className={isHighlighted ? 'text-blue-100' : 'text-gray-600'}>
                            /mois
                        </span>
                    )}
                </div>
                {billingPeriod === 'yearly' && tier.price_yearly && (
                    <p className={`text-sm font-medium ${isHighlighted ? 'text-blue-100' : 'text-green-600'
                        }`}>
                        {tier.price_yearly}€ facturés annuellement
                    </p>
                )}
            </div>

            <p className={`mb-8 ${isHighlighted ? 'text-blue-100' : 'text-gray-600'
                }`}>
                {tier.description}
            </p>

            <Link
                href={tier.plan === 'free' ? '/signup' : '/api/stripe/checkout'}
                className={`
          block w-full py-4 px-6 rounded-xl font-semibold text-center transition-all
          ${isHighlighted
                        ? 'bg-white text-blue-600 hover:shadow-xl hover:-translate-y-0.5'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:-translate-y-0.5'
                    }
        `}
            >
                {tier.cta}
            </Link>

            <ul className="mt-8 space-y-4">
                {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isHighlighted ? 'text-blue-100' : 'text-green-600'
                            }`} />
                        <span className={`text-sm ${isHighlighted ? 'text-blue-50' : 'text-gray-700'
                            }`}>
                            {feature}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="card-flat hover:border-gray-300 transition-all">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left group"
            >
                <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {question}
                </span>
                <span className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                    }`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="width" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>
            {isOpen && (
                <p className="mt-4 text-gray-600 leading-relaxed animate-fade-in">
                    {answer}
                </p>
            )}
        </div>
    );
}

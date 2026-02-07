'use client';

import Link from 'next/link';
import { BookOpen, ArrowLeft, Clock } from 'lucide-react';

export default function GlossaryPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
            {/* Header */}
            <header className="glass sticky top-0 z-50 border-b border-gray-200/50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/app" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                                <span className="text-white font-bold text-lg">C</span>
                            </div>
                            <span className="text-xl font-semibold text-gray-900">Correcteur</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-6 py-16">
                <div className="text-center">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                        <BookOpen className="w-10 h-10 text-green-600" />
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Glossaire personnel
                    </h1>

                    {/* Description */}
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Cette fonctionnalité arrive très bientôt ! Protégez vos termes spécifiques de toute correction.
                    </p>

                    {/* Coming Soon Badge */}
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full font-semibold mb-12">
                        <Clock className="w-5 h-5" />
                        Bientôt disponible
                    </div>

                    {/* Features Preview */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Termes protégés</h3>
                            <p className="text-sm text-gray-600">
                                Ajoutez vos noms propres, acronymes et jargon technique
                            </p>
                        </div>

                        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Catégories</h3>
                            <p className="text-sm text-gray-600">
                                Organisez par noms, acronymes, termes techniques, etc.
                            </p>
                        </div>

                        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Limites généreuses</h3>
                            <p className="text-sm text-gray-600">
                                10 termes en gratuit, illimité en Pro
                            </p>
                        </div>
                    </div>

                    {/* Example */}
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-8 mb-12 text-left max-w-2xl mx-auto">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Exemple d'utilisation
                        </h3>
                        <p className="text-gray-700 mb-4">
                            Vous travaillez chez <strong>Letelos</strong> et utilisez souvent le terme <strong>SaaS</strong> ?
                        </p>
                        <p className="text-gray-700">
                            Ajoutez-les à votre glossaire et Correcteur ne les touchera <strong>jamais</strong>, même s'ils ressemblent à des erreurs.
                        </p>
                    </div>

                    {/* CTA */}
                    <Link
                        href="/app"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-0.5 transition-all"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Retour à l'application
                    </Link>
                </div>
            </main>
        </div>
    );
}

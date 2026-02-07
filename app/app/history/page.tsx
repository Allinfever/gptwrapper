'use client';

import Link from 'next/link';
import { History, ArrowLeft, Clock } from 'lucide-react';

export default function HistoryPage() {
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
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                        <History className="w-10 h-10 text-blue-600" />
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Historique des corrections
                    </h1>

                    {/* Description */}
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Cette fonctionnalité arrive très bientôt ! Vous pourrez retrouver toutes vos corrections passées.
                    </p>

                    {/* Coming Soon Badge */}
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-semibold mb-12">
                        <Clock className="w-5 h-5" />
                        Bientôt disponible
                    </div>

                    {/* Features Preview */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                                <History className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Historique complet</h3>
                            <p className="text-sm text-gray-600">
                                Retrouvez toutes vos corrections des 7 derniers jours (illimité en Pro)
                            </p>
                        </div>

                        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Recherche avancée</h3>
                            <p className="text-sm text-gray-600">
                                Filtrez par date, type de document ou nombre d'erreurs
                            </p>
                        </div>

                        <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Export facile</h3>
                            <p className="text-sm text-gray-600">
                                Exportez vos corrections en PDF ou DOCX (Pro)
                            </p>
                        </div>
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

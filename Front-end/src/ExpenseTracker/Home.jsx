import { Link } from 'react-router-dom';
import { 
    ArrowRight, 
    PieChart, 
    Shield, 
    Zap, 
    TrendingUp 
} from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-background overflow-hidden font-sans relative transition-colors duration-300">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-10 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-10 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-10 animate-blob animation-delay-4000"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
                <div className="text-center max-w-4xl mx-auto mt-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-8 border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        ExpenseTracker 2.0 est en ligne
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight leading-tight mb-8 transition-colors">
                        Prenez le contrôle de <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-500">
                            votre avenir financier.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed transition-colors">
                        Suivez vos dépenses, analysez vos habitudes et atteignez vos objectifs avec l'application de gestion financière la plus intelligente du marché.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link 
                            to="/Register" 
                            className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 group"
                        >
                            Commencer gratuitement
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link 
                            to="/Login" 
                            className="w-full sm:w-auto px-8 py-4 bg-card text-card-foreground font-bold rounded-full border border-border shadow-sm hover:bg-accent hover:text-accent-foreground transition-all flex items-center justify-center gap-2"
                        >
                            Voir la démo
                        </Link>
                    </div>
                </div>
                <div className="mt-24 relative mx-auto max-w-5xl">
                    <div className="rounded-2xl border border-border/50 bg-background/50 backdrop-blur-xl p-2 shadow-2xl transition-colors">
                        <div className="rounded-xl overflow-hidden border border-border bg-muted/30 flex items-center justify-center h-64 md:h-96 relative">
                            
                            <div className="absolute top-8 left-8 p-4 bg-card rounded-xl shadow-sm border border-border animate-pulse">
                                <div className="h-4 w-24 bg-muted rounded mb-2"></div>
                                <div className="h-8 w-32 bg-green-500/20 rounded"></div>
                            </div>
                            
                            <div className="absolute bottom-8 right-8 p-4 bg-card rounded-xl shadow-sm border border-border animate-pulse delay-150">
                                <div className="h-4 w-24 bg-muted rounded mb-2"></div>
                                <div className="h-8 w-32 bg-red-500/20 rounded"></div>
                            </div>
                            
                            <PieChart className="w-32 h-32 text-primary opacity-20" />
                        </div>
                    </div>
                </div>

    
                <div className="mt-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-foreground mb-4 transition-colors">Pourquoi choisir notre plateforme ?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto transition-colors">Tout ce dont vous avez besoin pour gérer votre argent, sans la complexité des banques traditionnelles.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
                        <div className="bg-card p-8 rounded-3xl border border-border shadow-sm hover:shadow-md transition-all">
                            <div className="w-14 h-14 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6">
                                <Zap className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-card-foreground mb-3 transition-colors">Ultra Rapide</h3>
                            <p className="text-muted-foreground leading-relaxed transition-colors">Ajoutez vos transactions en quelques secondes. Une interface fluide conçue pour ne pas vous faire perdre de temps.</p>
                        </div>

            
                        <div className="bg-card p-8 rounded-3xl border border-border shadow-sm hover:shadow-md transition-all">
                            <div className="w-14 h-14 bg-green-500/10 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-6">
                                <TrendingUp className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-card-foreground mb-3 transition-colors">Statistiques Détaillées</h3>
                            <p className="text-muted-foreground leading-relaxed transition-colors">Visualisez vos dépenses par catégorie. Comprenez où va votre argent grâce à des graphiques clairs.</p>
                        </div>

            
                        <div className="bg-card p-8 rounded-3xl border border-border shadow-sm hover:shadow-md transition-all">
                            <div className="w-14 h-14 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-6">
                                <Shield className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-card-foreground mb-3 transition-colors">Données Sécurisées</h3>
                            <p className="text-muted-foreground leading-relaxed transition-colors">Vos informations financières sont chiffrées de bout en bout. Vous êtes le seul maître de vos données.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
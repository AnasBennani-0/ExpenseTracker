import { Link } from 'react-router-dom';
import { Wallet, Github, Twitter, Linkedin, Heart, Mail } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return ( 
        <footer className="relative bg-background pt-16 pb-8 mt-20 border-t border-border/40 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-70"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
                    <div className="col-span-1 md:col-span-5 flex flex-col items-start">
                        <Link to="/" className="flex items-center gap-2 group mb-5">
                            <div className="bg-primary/10 text-primary p-2.5 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 ring-1 ring-primary/20 group-hover:ring-primary/50 shadow-sm">
                                <Wallet className="w-5 h-5" />
                            </div>
                            <span className="font-extrabold text-2xl tracking-tight text-foreground">
                                Expense<span className="text-primary">Tracker</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm font-medium">
                            Reprenez le pouvoir sur votre argent. Suivez vos dépenses, analysez vos habitudes et atteignez vos objectifs financiers avec l'application la plus élégante du marché.
                        </p>
                    </div>

                  
                    <div className="col-span-1 md:col-span-3">
                        <h3 className="font-bold text-foreground mb-5 uppercase tracking-wider text-xs">Application</h3>
                        <ul className="space-y-3.5">
                            <li>
                                <Link to="/Transaction" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>
                                    Transactions
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>
                                    Tableau de bord
                                </Link>
                            </li>
                            <li>
                                <Link to="/GestionBuget" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary transition-colors"></span>
                                    Gestion de budget
                                </Link>
                            </li>
                        </ul>
                    </div>

                    
                    <div className="col-span-1 md:col-span-4">
                        <h3 className="font-bold text-foreground mb-5 uppercase tracking-wider text-xs">Support & Légal</h3>
                        <ul className="space-y-3.5">
                            <li>
                                <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                                    <Mail className="w-4 h-4 opacity-70" />
                                    support@expensetracker.ma
                                </a>
                            </li>
                            <li>
                                <Link to="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                    Politique de confidentialité
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                    Conditions d'utilisation
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                
                <div className="flex flex-col-reverse md:flex-row items-center justify-between pt-8 border-t border-border/40 gap-6">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                        © {currentYear} ExpenseTracker. 
                        
                        
                    </p>
                    
                    <div className="flex items-center gap-4">
                        <p>mehdi</p>
                        <a 
                            href="https://github.com/alaouiismailimehdi" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-foreground hover:text-background transition-all duration-300"
                            title="Mon GitLab"
                        >
                            <Github className="w-4 h-4" />
                        </a>
                         <a 
                            href="https://www.linkedin.com/in/mehdi-ismaili-alaoui-4ba844261/" 
                            className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-[#0A66C2] hover:text-white transition-all duration-300"
                        >
                            <Linkedin className="w-4 h-4" />
                        </a>
                        |
                        <p>anas</p>
                        <a 
                            href="https://github.com/AnasBennani-0?tab=stars" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-foreground hover:text-background transition-all duration-300"
                            title="Mon GitLab"
                        >
                            <Github className="w-4 h-4" />
                        </a>
                        <a 
                            href="https://www.linkedin.com/in/anas-bennani-365778263/" 
                            className="p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-[#1DA1F2] hover:text-white transition-all duration-300"
                        >
                            <Linkedin className="w-4 h-4" />
                        </a>
                       
                    </div>
                </div>
                
            </div>
        </footer>
     );
}
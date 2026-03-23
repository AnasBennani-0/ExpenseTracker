import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Wallet, LogOut, LayoutDashboard, Settings, Moon, Sun, ChevronDown } from 'lucide-react';
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

export default function Header() {
    const nav = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    
    // État pour gérer l'icône du mode sombre
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Effet pour le Glassmorphism au scroll
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Vérifier l'utilisateur connecté
    useEffect(() => {
        const checkUser = async () => {
            try {
                // J'ai ajouté withCredentials au cas où pour ta session Laravel
                const res = await axios.get("http://localhost:8000/user-data", { withCredentials: true });
                setUser(res.data);
            } catch (err) {
                setUser(null);
            }
        };
        checkUser();
    }, []);

    // Vérifier si le mode sombre est déjà actif au chargement
    useEffect(() => {
        if (document.documentElement.classList.contains('dark')) {
            setIsDarkMode(true);
        }
    }, []);

    // Toggle Mode Sombre avec animation
    const toggleDarkMode = () => {
        document.documentElement.classList.toggle('dark');
        setIsDarkMode(!isDarkMode);
    };

    const handlelogout = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/logout', {}, { withCredentials: true });
            setUser(null);
            nav("/login");
        } catch (error) {
            console.error("Erreur de déconnexion", error);
        }
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };


    const isActive = (path) => location.pathname.toLowerCase() === path.toLowerCase();

    return (
        <header 
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                isScrolled 
                ? 'bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-sm py-2' 
                : 'bg-background border-b border-transparent py-4'
            }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-8">
                
               
                <div className="flex items-center gap-10">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="bg-gradient-to-br from-primary to-blue-600 text-white p-2.5 rounded-xl group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300 ring-1 ring-primary/20">
                            <Wallet className="w-5 h-5" />
                        </div>
                        <span className="font-black text-2xl tracking-tight text-foreground transition-colors group-hover:opacity-80">
                            Expense<span className="text-primary">Tracker</span>
                        </span>
                    </Link>

                    
                    {user && (
                        <nav className="hidden md:flex items-center gap-2">
                            <Link 
                                to="/Dashboard" 
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                                    isActive('/Dashboard') || isActive('/')
                                    ? 'text-primary bg-primary/10 shadow-sm shadow-primary/5' 
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                }`}
                            >
                                Dashboard
                            </Link>
                            <Link 
                                to="/Transaction" 
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                                    isActive('/Transaction') 
                                    ? 'text-primary bg-primary/10 shadow-sm shadow-primary/5' 
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                }`}
                            >
                                Transactions
                            </Link>
                            <Link
                                to="/budget"
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                                    isActive('/GestionBuget') 
                                    ? 'text-primary bg-primary/10 shadow-sm shadow-primary/5' 
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                }`}
                            >
                                Budgets
                            </Link>
                        </nav>
                    )}
                </div>

               
                <div className="flex items-center gap-3 md:gap-5">
                    
                    
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={toggleDarkMode} 
                        className="rounded-full w-10 h-10 hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-300 hover:rotate-12"
                        title="Basculer le thème"
                    >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </Button>

                  
                    {user && <div className="hidden sm:block w-px h-6 bg-border/60"></div>}

                   
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-none group">
                                <div className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-accent/50 transition-all duration-200 cursor-pointer border border-transparent hover:border-border/60">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-transparent group-hover:ring-primary/20 ring-offset-2 ring-offset-background transition-all">
                                        {getInitials(user.name)}
                                    </div>
                                    <div className="hidden sm:flex flex-col items-start">
                                        <span className="text-sm font-bold text-foreground leading-none">
                                            {user.name.split(' ')[0]}
                                        </span>
                                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1">
                                            Membre
                                        </span>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors hidden sm:block ml-1" />
                                </div>
                            </DropdownMenuTrigger>
                            
                            <DropdownMenuContent align="end" className="w-64 mt-2 bg-card/95 backdrop-blur-xl border-border/60 shadow-2xl rounded-2xl p-2">
                                <DropdownMenuLabel className="font-normal p-3">
                                    <div className="flex flex-col space-y-1.5">
                                        <p className="text-base font-bold text-foreground">{user.name}</p>
                                        <p className="text-xs font-medium text-muted-foreground truncate">{user.email}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-border/60 mx-2" />
                                
                                <div className="p-1">
                                    <DropdownMenuItem onClick={() => nav('/Dashboard')} className="cursor-pointer font-medium focus:bg-accent focus:text-accent-foreground rounded-xl py-2.5">
                                        <LayoutDashboard className="mr-3 h-4 w-4 opacity-70" />
                                        <span>Mon Dashboard</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => nav('/Profile')} className="cursor-pointer font-medium focus:bg-accent focus:text-accent-foreground rounded-xl py-2.5">
                                        <Settings className="mr-3 h-4 w-4 opacity-70" />
                                        <span>Paramètres Profile</span>
                                    </DropdownMenuItem>
                                </div>
                                
                                <DropdownMenuSeparator className="bg-border/60 mx-2" />
                                
                                <div className="p-1">
                                    <DropdownMenuItem onClick={handlelogout} className="text-destructive font-bold focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-xl py-2.5 transition-colors">
                                        <LogOut className="mr-3 h-4 w-4" />
                                        <span>Se déconnecter</span>
                                    </DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" asChild className="hidden sm:flex text-foreground hover:bg-accent rounded-full font-bold px-5">
                                <Link to="/Login">Connexion</Link>
                            </Button>
                            <Button asChild className="rounded-full px-6 font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                                <Link to="/Register">Créer un compte</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
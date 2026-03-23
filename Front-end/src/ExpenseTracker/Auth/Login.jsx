import { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button'; 
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Wallet, Mail, Lock, Loader2, ArrowRight, AlertCircle } from "lucide-react";

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const nav = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const API_URL = process.env.REACT_APP_API_URL;
            await axios.get(`${API_URL}/sanctum/csrf-cookie`);
            await axios.post(`${API_URL}/login`, {
                email: emailRef.current.value,
                password: passwordRef.current.value
            });
            window.location.href = "/Transaction"; 
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setError("Email ou mot de passe incorrect.");
            } else {
                setError("Erreur de connexion. Vérifiez vos identifiants.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
       
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-2xl shadow-xl border border-border">
                
                <div className="text-center space-y-2">
                    <div className="mx-auto bg-primary text-primary-foreground w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg rotate-3 hover:rotate-0 transition-transform duration-300">
                        <Wallet className="w-6 h-6" />
                    </div>
                   
                    <h1 className="text-3xl font-extrabold tracking-tight text-card-foreground">Bon retour !</h1>
                    <p className="text-muted-foreground text-sm">Entrez vos identifiants pour accéder à votre compte.</p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-lg animate-in fade-in">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-foreground">Adresse Email</Label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input id="email" type="email" placeholder="nom@exemple.com" ref={emailRef} className="pl-10 h-11 bg-background" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="text-foreground">Mot de passe</Label>
                                <Link to="#" className="text-xs font-semibold text-primary hover:underline">Oublié ?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input id="password" type="password" placeholder="••••••••" ref={passwordRef} className="pl-10 h-11 bg-background" required />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button type="submit" className="w-full h-11 font-bold text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center gap-2">Se connecter <ArrowRight className="w-4 h-4" /></span>}
                        </Button>
                    </div>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                    Pas encore de membre ?{' '}
                    <Link to="/Register" className="font-bold text-primary hover:text-primary/80 transition-colors">
                        Créer un compte
                    </Link>
                </p>
            </div>
        </div>
    );
}
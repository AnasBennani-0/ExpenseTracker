import { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Wallet, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

export default function Register() {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const nav = useNavigate();
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrors({}); 
        setIsLoading(true);
        try {
            await axios.post('http://localhost:8000/register', {
                name: nameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value,
                password_confirmation: passwordConfirmRef.current.value 
            });
            nav("/login");
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ general: ["Une erreur inattendue est survenue."] });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="max-w-md w-full bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
                <div className="p-8 text-center border-b border-border/50 bg-muted/20">
                    <div className="mx-auto bg-primary text-primary-foreground w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-card-foreground tracking-tight">Créer un compte</h2>
                    <p className="text-sm text-muted-foreground mt-2">Commencez à gérer vos dépenses comme un pro.</p>
                </div>

                <div className="p-8">
                    {errors.general && (
                        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg text-center font-medium">
                            {errors.general[0]}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase">Nom complet</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input id="name" type="text" ref={nameRef} placeholder="Nom complet..." className={`pl-10 bg-background ${errors.name ? 'border-destructive focus-visible:ring-destructive' : ''}`} required />
                            </div>
                            {errors.name && <p className="text-xs text-destructive font-medium mt-1">{errors.name[0]}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase">Adresse Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input id="email" type="email" ref={emailRef} placeholder="Email@example.com" className={`pl-10 bg-background ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`} required />
                            </div>
                            {errors.email && <p className="text-xs text-destructive font-medium mt-1">{errors.email[0]}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-xs font-bold text-muted-foreground uppercase">Mot de passe</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input id="password" type="password" ref={passwordRef} placeholder="••••••••" className={`pl-10 bg-background ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`} required />
                            </div>
                            {errors.password && <p className="text-xs text-destructive font-medium mt-1">{errors.password[0]}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="password_confirmation" className="text-xs font-bold text-muted-foreground uppercase">Confirmer le mot de passe</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input id="password_confirmation" type="password" ref={passwordConfirmRef} placeholder="••••••••" className="pl-10 bg-background" required />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-11 text-base font-semibold mt-4" disabled={isLoading}>
                            {isLoading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <>S'inscrire <ArrowRight className="w-4 h-4 ml-2" /></>}
                        </Button>
                    </form>
                    <p className="text-center text-sm text-muted-foreground mt-6">
                        Déjà un compte ? <Link to="/login" className="font-bold text-primary hover:underline">Connectez-vous ici</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
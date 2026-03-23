"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { User, Mail, Lock, Save, RotateCcw, ShieldCheck } from "lucide-react"
import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from 'react-router-dom';
import { Button } from "../components/ui/button" 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { useNavigate } from 'react-router-dom'; // On enlève Link, on met useNavigate

const formSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères."),
  email: z.string().email("Email invalide."),
  password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères.").optional().or(z.literal('')),
})

export default function Profile() {
  const [loading, setLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // RÉCUPÉRATION DES DONNÉES (S'exécute une seule fois)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8000/user-data", { withCredentials: true });
        form.reset({
          name: res.data.name,
          email: res.data.email,
          password: "", 
        });
      } catch (err) {
        toast.error("Impossible de charger les données utilisateur");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [form]); 

  const nav = useNavigate();
  const onSubmit = async (data) => {
    try {
      const payload = { ...data };
      if (!payload.password) delete payload.password;

      await axios.put("http://localhost:8000/user/update", payload, { withCredentials: true });
      
      toast.success("Profil mis à jour !", {
        description: "Vos modifications ont été enregistrées avec succès.",
        icon: <ShieldCheck className="text-emerald-500" />
      });
      nav("/Dashboard");
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Erreur lors de la mise à jour";
      toast.error(errorMsg);
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="p-6 md:p-8 flex justify-center items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="w-full sm:max-w-lg bg-card/50 backdrop-blur-xl border-border/60 shadow-2xl rounded-3xl overflow-hidden relative">
        <CardHeader className="pb-6 pt-8 border-b border-border/40 bg-muted/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
              <User className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black tracking-tight text-foreground">Paramètres du Compte</CardTitle>
              <CardDescription className="font-medium">Gérez vos informations de connexion.</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-8 space-y-6">
          <form id="form-profile" onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 pl-1">
                <User className="w-3.5 h-3.5" /> Nom complet
              </Label>
              <Input {...form.register("name")} className="rounded-xl h-12 bg-background/50 border-border/60 focus:ring-primary/20 transition-all" />
              {form.formState.errors.name && <p className="text-destructive text-xs font-bold pl-1">{form.formState.errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 pl-1">
                <Mail className="w-3.5 h-3.5" /> Adresse Email
              </Label>
              <Input {...form.register("email")} className="rounded-xl h-12 bg-background/50 border-border/60 focus:ring-primary/20 transition-all" />
              {form.formState.errors.email && <p className="text-destructive text-xs font-bold pl-1">{form.formState.errors.email.message}</p>}
            </div>

            <div className="space-y-2 pt-4 border-t border-border/40">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 pl-1">
                <Lock className="w-3.5 h-3.5" /> Nouveau mot de passe
              </Label>
              <Input {...form.register("password")} type="password" placeholder="Laissez vide pour conserver l'actuel" className="rounded-xl h-12 bg-background/50 border-border/60 focus:ring-primary/20 transition-all" />
              {form.formState.errors.password && <p className="text-destructive text-xs font-bold pl-1">{form.formState.errors.password.message}</p>}
            </div>

          </form>
        </CardContent>

        <CardFooter className="pt-4 pb-8 px-6 bg-muted/5 border-t border-border/40">
          <div className="flex w-full items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => form.reset()} className="rounded-xl h-11 border-border/60 hover:bg-muted font-bold transition-all">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
            <Button   type="submit" form="form-profile" className="rounded-xl h-11 px-8 bg-primary font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
              <Save className="w-4 h-4 mr-2" />Sauvegarder 
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
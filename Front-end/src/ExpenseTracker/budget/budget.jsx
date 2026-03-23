import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PiggyBank, Target, Calendar, Trash2, Loader2, LayoutGrid } from "lucide-react";

// --- IMPORTS SLICES ---
import { addBudgets, fetchBudgets, deleteBudgets } from "../store/BudgSlice";
import { getCat } from "../store/CatSlice";
// 🎉 Plus besoin d'importer fetchTransactions ici, Laravel fait le calcul !

// --- IMPORTS UI ---
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Progress } from "../../components/ui/progress";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

function Budget() {
  const dispatch = useDispatch();
  
  const dbC = useSelector(st => st.categories?.dbCat || []);
  const dbBudgets = useSelector(st => st.budgets?.dbbudg || []); 
  const loading = useSelector(st => st.budgets?.loading);

  const txtamount = useRef();
  const txtmonth = useRef();
  const [category, setcategory] = useState("");

  useEffect(() => {
    dispatch(getCat()); 
    dispatch(fetchBudgets());
    // 🎉 Plus besoin de dispatch(fetchTransactions()), ça allège la charge réseau !
  }, [dispatch]);

  const ajouteHandler = async () => {
    if(!category || !txtamount.current.value || !txtmonth.current.value) return;

    const monthVal = txtmonth.current.value;
    const formattedMonth = monthVal.length === 7 ? `${monthVal}-01` : monthVal;

    const newB = {
      category_id: category,
      amount: parseFloat(txtamount.current.value),
      month: formattedMonth, 
    };

    await dispatch(addBudgets(newB));
    
    txtamount.current.value = "";
    txtmonth.current.value = "";
    setcategory("");
  };

  const budgetStats = useMemo(() => {
    return dbBudgets.map((budget) => {
      // On récupère le nom de la catégorie (Laravel l'envoie via with('category'), mais on garde la sécurité dbC au cas où)
      const categoryObj = dbC.find(c => String(c.id) === String(budget.category_id));
      
      // 👉 LA MAGIE EST ICI : On récupère directement la somme renvoyée par Laravel
      const spent = parseFloat(budget.spent) || 0;
      
      const limit = parseFloat(budget.amount) || 1;
      
      return {
        ...budget,
        categoryName: budget.category?.name || categoryObj?.name || "Catégorie",
        spent,
        progress: Math.min((spent / limit) * 100, 100),
        isOver: spent > limit
      };
    });
  }, [dbBudgets, dbC]); // dbTransactions a disparu des dépendances

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-2xl ring-1 ring-primary/20">
          <PiggyBank className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground font-medium">Suivi de vos limites mensuelles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Formulaire d'ajout */}
        <Card className="lg:col-span-4 h-fit rounded-3xl shadow-lg border-border/60">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" /> Nouveau Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5"><Label>Mois</Label><Input type="month" ref={txtmonth} className="rounded-xl" /></div>
            <div className="space-y-1.5">
              <Label>Catégorie</Label>
              <Select value={category} onValueChange={setcategory}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Choisir..." /></SelectTrigger>
                <SelectContent>{dbC.map((cat) => (<SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Limite (DH)</Label><Input type="number" ref={txtamount} placeholder="Ex: 3000" className="rounded-xl font-bold" /></div>
          </CardContent>
          <CardFooter><Button onClick={ajouteHandler} className="w-full rounded-xl">Enregistrer</Button></CardFooter>
        </Card>

        {/* Liste des Budgets */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading && budgetStats.length === 0 ? (
            <div className="col-span-full flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>
          ) : budgetStats.length > 0 ? (
            budgetStats.map((b) => (
              <Card key={b.id} className={`p-5 rounded-3xl border-2 transition-all ${b.isOver ? 'border-red-500/40 bg-red-50 dark:bg-red-950/20' : 'border-border/60'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-lg">{b.categoryName}</h4>
                    <span className="text-[10px] text-muted-foreground font-bold flex items-center gap-1"><Calendar className="w-3 h-3" /> {b.month?.substring(0, 7)}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => dispatch(deleteBudgets(b.id))} className="hover:text-red-500"><Trash2 className="w-4 h-4" /></Button>
                </div>
                <div className="flex justify-between items-end mb-2">
                  <span className={`text-2xl font-black ${b.isOver ? 'text-red-600' : 'text-foreground'}`}>{b.spent.toLocaleString()} <span className="text-xs font-normal">DH</span></span>
                  <span className="text-[10px] font-bold text-muted-foreground">MAX: {b.amount} DH</span>
                </div>
                <Progress value={b.progress} className="h-2.5" />
                <div className="flex justify-between mt-3 text-[10px] font-bold">
                  <p className={b.isOver ? 'text-red-600' : 'text-muted-foreground'}>{b.isOver ? 'DÉPASSÉ' : `${(b.amount - b.spent).toLocaleString()} DH RESTANTS`}</p>
                  <p className="bg-muted px-1.5 rounded">{b.progress.toFixed(0)}%</p>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl opacity-40">
              <LayoutGrid className="mx-auto w-10 h-10 mb-2" /><p className="text-xs font-bold uppercase tracking-widest">Aucun budget</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Budget;
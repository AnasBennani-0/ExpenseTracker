import { useSelector, useDispatch } from "react-redux"; 
import { useState, useEffect } from "react"; 
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { FilterIcon, RotateCcw, CalendarDays, Layers, Activity } from "lucide-react";
import { Button } from "../../components/ui/button";
import { fetchTransactions } from "../store/TransSlice";
import Search from "./Search";

export default function Filter({ setCurrentPage }) {
  const dispatch = useDispatch();
  const dbC = useSelector((st) => st.categories.dbCat);
  const [filters, setFilters] = useState({
    category_id: "all",
    type: "all",
    month: "",
    note: ""
  });

  // Le useEffect rassemble TOUS les filtres intelligents
  useEffect(() => {
    const params = {};
    
    if (filters.category_id !== "all") params.category_id = filters.category_id;
    if (filters.type !== "all") params.type = filters.type;
    if (filters.note !== "") params.note = filters.note;  
    
    if (filters.month) {
      params.start_date = `${filters.month}-01`;
      params.end_date = `${filters.month}-31`;
    }

    dispatch(fetchTransactions(params));
  }, [filters, dispatch]);

  const handleReset = () => {
    setFilters({
      category_id: "all",
      type: "all",
      month: "",
      note: ""
    });
    if (setCurrentPage) setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-5 p-5 md:p-6 bg-card/40 backdrop-blur-xl border border-border/60 rounded-3xl shadow-lg mb-8 transition-all">
      
      {/* EN-TÊTE DU FILTRE */}
      <div className="flex items-center gap-3 border-b border-border/40 pb-4">
        <div className="p-2 bg-primary/10 rounded-xl ring-1 ring-primary/20">
          <FilterIcon className="w-4 h-4 text-primary" />
        </div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground/90">
          Filtres & Recherche
        </h2>
      </div>

      {/* CONTENEUR DES CHAMPS */}
      <div className="flex flex-wrap items-end gap-5">
        
        {/* PAR CATÉGORIE */}
        <div className="space-y-2 flex-1 min-w-50">
          <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Par Catégorie
          </Label>
          <Select 
            value={filters.category_id} 
            onValueChange={(val) => {
              setFilters({ ...filters, category_id: val });
              if (setCurrentPage) setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full h-10 bg-background/50 border-border/60 hover:bg-accent/50 transition-colors rounded-xl">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-md border-border rounded-xl shadow-xl">
              <SelectGroup>
                <SelectItem value="all" className="font-medium">Toutes les catégories</SelectItem>
                {dbC.map((el) => (
                  <SelectItem key={el.id} value={el.id.toString()} className="font-medium">
                    {el.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 flex-1 min-w-45">
          <Label htmlFor="type-filter" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5" /> Type d'opération
          </Label>
          <Select 
            value={filters.type} 
            onValueChange={(val) => {
              setFilters({ ...filters, type: val });
              if (setCurrentPage) setCurrentPage(1);
            }}
          >
            <SelectTrigger id="type-filter" className="w-full h-10 bg-background/50 border-border/60 hover:bg-accent/50 transition-colors rounded-xl">
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent className="bg-card/95 backdrop-blur-md border-border rounded-xl shadow-xl">
              <SelectGroup>
                <SelectItem value="all" className="font-medium">Tous les types</SelectItem>
                <SelectItem value="income" className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 ring-2 ring-green-500/20" />
                    Revenus
                  </div>
                </SelectItem>
                <SelectItem value="expense" className="font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 ring-2 ring-red-500/20" />
                    Dépenses
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* PAR PÉRIODE */}
        <div className="space-y-2 flex-1 min-w-40">
          <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" /> Période
          </Label>
          <Input
            type="month"
            value={filters.month}
            onChange={(e) => {
              setFilters({ ...filters, month: e.target.value });
              if (setCurrentPage) setCurrentPage(1);
            }}
            className="w-full h-10 bg-background/50 border-border/60 hover:bg-accent/50 transition-colors rounded-xl cursor-pointer"
          />
        </div>
        
       
        <div className="space-y-2 flex-2 min-w-62,5">
          <Label className="text-[11px] font-bold text-transparent uppercase tracking-wider select-none hidden md:block">
            Recherche
          </Label>
          <Search 
            onSearch={(texte) => {
              if (setCurrentPage) setCurrentPage(1); 
              setFilters({ ...filters, note: texte }); 
            }} 
          />
        </div>
        
       
        <div className="shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-10 px-4 bg-background/50 border-border/60 text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-all rounded-xl"
            title="Effacer tous les filtres"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline font-medium">Réinitialiser</span>
          </Button>
        </div>

      </div>
    </div>
  );
}
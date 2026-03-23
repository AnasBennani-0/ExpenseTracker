import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../../components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { MoreHorizontalIcon, Calendar as CalendarIcon, ArrowRightLeft, FileText, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { deleteTransaction, fetchTransactions } from "../store/TransSlice";
import { getCat } from "../store/CatSlice";
import FormTrans from "./formTrans";
import Filter from "./Filter";

export default function Transaction() {
  const dispatch = useDispatch();
  const [editTrans, setEditTrans] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Tes variables venant du store Redux
  const db = useSelector((st) => st.transaction.dbtrans) || [];
  const meta = useSelector((st) => st.transaction.meta) || { total: 0, current_page: 1, last_page: 1 };
  const dbC = useSelector((st) => st.categories.dbCat) || [];

  useEffect(() => {
    dispatch(fetchTransactions({ page: currentPage }));
    dispatch(getCat());
  }, [dispatch, currentPage]);

  // Fonction pour exporter en CSV
  const exportToCSV = () => {
    // On utilise bien "db" ici, car c'est le nom de ta variable Redux
    if (!db || db.length === 0) {
      alert("Aucune transaction à exporter.");
      return;
    }

    const headers = ["ID", "Date", "Montant (DH)", "Type", "Categorie", "Note"];

    const csvRows = db.map(t => {
      const catName = dbC.find(c => String(c.id) === String(t.category_id))?.name || "Inconnue";
      const typeLabel = t.type === 'expense' ? 'Dépense' : 'Revenu';
      return [
        t.id,
        t.date,
        t.amount,
        typeLabel,
        `"${catName}"`,
        `"${t.note || ''}"`
      ].join(",");
    });

    const csvString = [headers.join(","), ...csvRows].join("\n");

   
    const blob = new Blob(["\uFEFF" + csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Mes_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
  
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl ring-1 ring-primary/20">
            <ArrowRightLeft className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
              Historique des Transactions
            </h1>
            <p className="text-muted-foreground font-medium mt-1">Gérez et filtrez vos mouvements financiers.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            onClick={exportToCSV} 
            variant="outline" 
            className="flex items-center gap-2 border-green-600 text-green-600 hover:bg-green-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Exporter CSV
          </Button>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-500 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <FormTrans modif={editTrans} clearModif={() => setEditTrans(null)} />
            </div>
          </div>
        </div>
      </div>

      {/* Barre de Filtre */}
      <Filter setCurrentPage={setCurrentPage} />

      {/* Tableau des Transactions */}
      <div className="bg-card/50 backdrop-blur-xl border border-border/60 rounded-3xl shadow-xl overflow-hidden transition-all duration-300">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30 border-b border-border/50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-24 text-muted-foreground font-semibold uppercase tracking-wider text-xs">ID</TableHead>
                <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider text-xs">Montant</TableHead>
                <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider text-xs">Type</TableHead>
                <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider text-xs">Date</TableHead>
                <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider text-xs">Catégorie</TableHead>
                <TableHead className="text-muted-foreground font-semibold uppercase tracking-wider text-xs">Note</TableHead>
                <TableHead className="text-right text-muted-foreground font-semibold uppercase tracking-wider text-xs pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {db.length > 0 ? (
                db.map((el) => {
                  const category = dbC.find((cat) => cat.id == el.category_id);
                  return (
                    <TableRow key={el.id} className="group hover:bg-muted/40 transition-colors duration-200 border-b border-border/40">
                      <TableCell className="font-mono text-xs text-muted-foreground/70 pl-4">#{el.id}</TableCell>
                      
                      <TableCell className="font-extrabold text-foreground text-base">
                        {Number(el.amount).toLocaleString()} <span className="text-xs font-medium text-muted-foreground">DH</span>
                      </TableCell>
                      
                      <TableCell>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                          el.type === "income" 
                            ? "bg-green-500/10 text-green-600 ring-1 ring-green-500/20" 
                            : "bg-red-500/10 text-red-600 ring-1 ring-red-500/20"
                        }`}>
                          {el.type === "income" ? "Revenu" : "Dépense"}
                        </span>
                      </TableCell>
                      
                      <TableCell className="text-muted-foreground font-medium text-sm flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 opacity-40" />
                        {el.date}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <span 
                            className="w-2.5 h-2.5 rounded-full shadow-sm" 
                            style={{ backgroundColor: category?.color || "#cbd5e1" }} 
                          />
                          <span className="font-semibold text-foreground/90 text-sm">
                            {category ? category.name : "Sans catégorie"}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="max-w-45 truncate text-muted-foreground italic text-sm">
                        {el.note || <span className="opacity-50">-</span>}
                      </TableCell>
                      
                      <TableCell className="text-right pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent text-muted-foreground hover:text-foreground rounded-lg transition-colors">
                              <MoreHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 bg-card/95 backdrop-blur-md border-border shadow-xl rounded-xl">
                            <DropdownMenuItem className="cursor-pointer font-medium focus:bg-accent focus:text-accent-foreground rounded-md" onClick={() => setEditTrans(el)}>
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border/60" />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button className="flex w-full items-center px-2 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                                  Supprimer
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-card border-border shadow-2xl rounded-2xl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-foreground">Confirmer la suppression ?</AlertDialogTitle>
                                  <AlertDialogDescription className="text-muted-foreground">
                                    Attention, cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
                                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl" onClick={() => dispatch(deleteTransaction(el.id))}>
                                    Supprimer définitivement
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-24">
                    <div className="flex flex-col items-center justify-center text-muted-foreground animate-pulse">
                      <FileText className="w-12 h-12 opacity-20 mb-4" />
                      <p className="text-lg font-semibold text-foreground/60">Aucune transaction trouvée</p>
                      <p className="text-sm mt-1">Commencez par en ajouter une via le bouton en haut !</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/40 bg-muted/10">
          <p className="text-sm text-muted-foreground hidden sm:block font-medium">
            Total : <span className="font-bold text-foreground">{meta?.total || 0}</span> transactions
          </p>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(currentPage - 1)} 
              disabled={!meta || meta.current_page === 1} 
              className="rounded-xl shadow-sm transition-all"
            >
              Précédent
            </Button>
            
            <div className="text-sm font-semibold text-muted-foreground px-2">
              Page <span className="text-foreground">{meta?.current_page || 1}</span> sur {meta?.last_page || 1}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(currentPage + 1)} 
              disabled={!meta || meta.current_page === meta.last_page} 
              className="rounded-xl shadow-sm transition-all"
            >
              Suivant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
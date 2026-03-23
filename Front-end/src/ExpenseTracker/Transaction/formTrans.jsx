import { Button } from "../../components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Field, FieldGroup } from "../../components/ui/field"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { useDispatch, useSelector } from "react-redux";
import { addTransaction, updateTransaction } from "../store/TransSlice";
import { useRef, useState, useEffect } from "react";

export default function DialogTran({ modif, clearModif }) {
  const dbC = useSelector(st => st.categories.dbCat);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [btnText, setBtnText] = useState("Save changes");

  const amounttxt = useRef(null);
  const datetxt = useRef(null);
  const txtnote = useRef(null);
  const categoryRef = useRef("");
  
  // 👉 CORRECTIF 1 : On définit "expense" par défaut au cas où l'utilisateur ne touche pas au select
  const typeRef = useRef("expense"); 
  
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (modif) {
      setBtnText("Update Transaction");
      setOpen(true);
      
      setTimeout(() => {
        if (amounttxt.current) amounttxt.current.value = modif.amount;
        if (datetxt.current) datetxt.current.value = modif.date;
        if (txtnote.current) txtnote.current.value = modif.note || "";
        categoryRef.current = modif.category_id.toString();
        typeRef.current = modif.type;
      }, 50);
    } else {
      setBtnText("Save changes");
    }
  }, [modif]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const transactionData = {
      amount: parseFloat(amounttxt.current.value),
      date: datetxt.current.value,
      category_id: parseInt(categoryRef.current),
      
      // 👉 CORRECTIF 2 : On utilise la vraie valeur sélectionnée
      type: typeRef.current, 
      
      note: txtnote.current.value,
    };

    if (modif) {
      dispatch(updateTransaction({ 
        id: modif.id, 
        data: transactionData 
      }));
    } else {
      dispatch(addTransaction(transactionData));
    }

    if (clearModif) clearModif();
    setOpen(false);
    e.target.reset();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val && clearModif) clearModif(); 
    }}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => {
            setOpen(true);
            if(clearModif) clearModif();
        }}>
           + Transaction
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {modif ? "Modifier la transaction" : "Ajouter une transaction"}
            </DialogTitle>
            <DialogDescription>
              Veuillez renseigner les informations requises pour enregistrer une transaction.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="space-y-4 py-4">
            <Field>
              <Label htmlFor="amount">Montant de la transaction</Label>
              <Input 
                id="amount" 
                type="number" 
                step="0.01" 
                ref={amounttxt} 
                required 
                placeholder="0.00"
              />
            </Field>

            <Field>
              <Label htmlFor="date">Date de transaction</Label>
              <Input 
                id="date" 
                type="date" 
                ref={datetxt} 
                required 
              />
            </Field>

            <Field>
              <Label htmlFor="category_id">Catégorie</Label>
              <Select 
                key={modif ? `edit-${modif.id}` : 'add'} 
                defaultValue={modif?.category_id?.toString()} 
                onValueChange={(val) => categoryRef.current = val} 
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Catégories</SelectLabel>
                    {dbC && dbC.map((e) => (
                      <SelectItem key={e.id} value={e.id.toString()}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <Label htmlFor="type">Nature de l'opération</Label>
              <Select 
                key={modif ? `type-${modif.id}` : 'type-add'} 
                defaultValue={modif?.type || "expense"} 
                onValueChange={(val) => typeRef.current = val} 
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Type d'opération" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Nature</SelectLabel>
                    <SelectItem value="expense">Dépense (Expense)</SelectItem>
                    <SelectItem value="income">Revenu (Income)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <Label htmlFor="note">Description (Note)</Label>
              <Input 
                id="note" 
                placeholder="Détails de l'opération..." 
                ref={txtnote} 
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button" ref={closeBtnRef}>
                Annuler
              </Button>
            </DialogClose>
            <Button type="submit">{btnText}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
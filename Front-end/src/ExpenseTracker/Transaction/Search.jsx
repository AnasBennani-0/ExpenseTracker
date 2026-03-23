import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Field } from "../../components/ui/field";
import { Input } from "../../components/ui/input";
import { Search as SearchIcon } from "lucide-react"; 

export default function Search({ onSearch }) {

  const [note, setNote] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(note);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center gap-2">
      <Field orientation="horizontal" className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        
        <Input 
          type="search" 
          placeholder="Chercher avec Note..." 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="pl-9 bg-background text-foreground border-border w-full" 
        />
      </Field>
      
      <Button type="submit">Search</Button>
    </form>
  );
}
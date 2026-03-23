<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategorieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories=Categorie::where("user_id",Auth::id())->get();
        return response()->json($categories);
    }
    public function store(Request $request)
    {
        $validated=$request->validate([
            'name'=>'required|string|max:55',
            'color'=>'required|string|max:55',
            'icon'=>'nullable',
            'is_default'=>'required'       
        ]);
        $validated["user_id"]=Auth::id();
        $categorie=Categorie::create($validated);
        return response()->json($categorie,201);

    }

    public function update(Request $request, Categorie $categorie)
    {
        $validated=$request->validate([
            'name'=>'required|string|max:55',
            'color'=>'required|string|max:55',
            'icon'=>'nullable',
            'is_default'=>'required'       
        ]);
        $validated["user_id"]=Auth::id();
        $categorie->update($validated);
        return response()->json($categorie);
    }

    public function destroy(Categorie $categorie)
    {
        $categorie->delete();
        return response()->json(['message'=>'Catégorie supprimée']);
    }
}
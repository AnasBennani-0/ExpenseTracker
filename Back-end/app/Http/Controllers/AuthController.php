<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $req) {
      
        $credentials = $req->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],  
        ]);
    
        if (Auth::attempt($credentials)) {
            $req->session()->regenerate();
            return response()->json([
                'user' => Auth::user(),
                'message' => 'Succès'
            ], 200);
        }
    
        return response()->json([
            'message' => 'Email ou mot de passe incorrect.'
        ], 422);
    
    }

    public function logout(Request $req) {
        Auth::guard('web')->logout();
        $req->session()->invalidate();
        $req->session()->regenerateToken();

        return response()->json(['message' => 'Déconnexion réussie']);
    }
    
    public function register(Request $req)
    {
        $valid = $req->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

 
        $user = User::create($valid);

        $defaultCategories = [
                ['name' => 'Nourriture', 'icon' => 'Utensils', 'color' => '#ef4444'],
                ['name' => 'Transport', 'icon' => 'Car', 'color' => '#3b82f6'],
                ['name' => 'Loisirs', 'icon' => 'Gamepad', 'color' => '#10b981'],
                ['name' => 'Logement', 'icon' => 'Home', 'color' => '#f59e0b'],
                ['name' => 'Santé', 'icon' => 'Heart', 'color' => '#ec4899'],
            ];

        foreach($defaultCategories as $cat){
            Categorie::create([
                'user_id'=>$user->id,
                'name'=>$cat['name'],
                'icon'=>$cat['icon'],
                'color'=>$cat['color'],
                'is_default'=>"0"
            ]);
        }
        Auth::login($user);

        return response()->json([
            'user' => $user,
            'message' => 'Inscription, création des catégories et connexion réussies'
        ], 201);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        $user = \App\Models\User::find(Auth::id());
    
        $request->validate([
            'name' => 'required|string|min:3',
            // On autorise l'email actuel, mais on interdit celui d'un autre
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6',
        ]);
    
        $user->name = $request->name;
        $user->email = $request->email;
    
        // On ne change le mot de passe que s'il est rempli
        if ($request->filled('password')) {
            $user->password = \Illuminate\Support\Facades\Hash::make($request->password);
        }
    
        $user->save();
    
        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $user
        ]);
    }
}
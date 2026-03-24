<?php

namespace App\Http\Controllers;

use App\Models\Categorie;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash; // <-- N'oublie pas cet import

class AuthController extends Controller
{
    public function login(Request $req) {
        $credentials = $req->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],  
        ]);
       
        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            // On purge la base de données des vieux tokens pour garder ça propre
            $user->tokens()->delete();

            $token = $user->createToken('ExpenseTrackerToken')->plainTextToken;
            
            return response()->json([
                'user' => $user,
                'token' => $token,
                'message' => 'Succès'
            ], 200);
        }

        return response()->json([
            'message' => 'Email ou mot de passe incorrect.'
        ], 422);
    }

    public function logout(Request $req) {
        // Au lieu de tuer une session, on détruit le jeton API qui a servi à faire la requête
        $req->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnexion réussie']);
    }
    
    public function register(Request $req)
    {
        $valid = $req->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Assure-toi que le mot de passe est bien haché lors de la création
        $user = User::create([
            'name' => $valid['name'],
            'email' => $valid['email'],
            'password' => Hash::make($valid['password']), 
        ]);

        $defaultCategories = [
            ['name' => 'Nourriture', 'icon' => 'Utensils', 'color' => '#ef4444'],
            ['name' => 'Transport', 'icon' => 'Car', 'color' => '#3b82f6'],
            ['name' => 'Loisirs', 'icon' => 'Gamepad', 'color' => '#10b981'],
            ['name' => 'Logement', 'icon' => 'Home', 'color' => '#f59e0b'],
            ['name' => 'Santé', 'icon' => 'Heart', 'color' => '#ec4899'],
        ];

        foreach($defaultCategories as $cat){
            Categorie::create([
                'user_id' => $user->id,
                'name' => $cat['name'],
                'icon' => $cat['icon'],
                'color' => $cat['color'],
                'is_default' => "0"
            ]);
        }

        // On génère un Token immédiatement après l'inscription
        $token = $user->createToken('ExpenseTrackerToken')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token, // <-- Le frontend reçoit son passeport ici aussi
            'message' => 'Inscription, création des catégories et connexion réussies'
        ], 201);
    }

    public function update(Request $request)
    {
        // Récupération propre de l'utilisateur via la requête API (pas de Auth::id() redondant)
        $user = $request->user();
    
        $request->validate([
            'name' => 'required|string|min:3',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:6',
        ]);
    
        $user->name = $request->name;
        $user->email = $request->email;
    
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
    
        $user->save();
    
        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $user
        ]);
    }
}
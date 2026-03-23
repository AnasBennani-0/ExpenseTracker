<?php

namespace Database\Seeders;

use App\Models\Budget;
use App\Models\Categorie;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Création de ton compte principal
        $user = User::create([
            'name' => 'Anas Bennani',
            'email' => 'anas@test.com',
            'password' => Hash::make('12345678'),
        ]);

        // 2. Créer des catégories pour cet utilisateur
        // On récupère les IDs dans un tableau pour les utiliser facilement après
        $categoryNames = ['Nourriture', 'Transport', 'Loisirs', 'Loyer', 'Salaire'];
        $categories = [];

        foreach ($categoryNames as $name) {
            $categories[] = Categorie::create([
                'name' => $name,
                'user_id' => $user->id,
                'icon' => 'Star',
                'color' => sprintf('#%06X', mt_rand(0, 0xFFFFFF)), // Couleurs aléatoires
                'is_default' => "0"
            ]);
        }

        // Transformer en collection pour utiliser random() correctement
        $categoryCollection = collect($categories);

        // 3. Créer des transactions de dépenses (Mélangées)
        // On utilise sequence() pour que chaque transaction ait une catégorie aléatoire
        Transaction::factory(100)->create([
            'user_id' => $user->id,
            'type' => 'expense',
            'category_id' => fn() => $categoryCollection->where('name', '!=', 'Salaire')->random()->id,
            'date' => now()->format('Y-m-d'), // On force sur ce mois pour voir le progress
        ]);

        // 4. Créer des revenus (Incomes)
        Transaction::factory(5)->create([
            'user_id' => $user->id,
            'category_id' => $categoryCollection->where('name', 'Salaire')->first()->id, 
            'type' => 'income',
            'amount' => 5000,
            'date' => now()->startOfMonth()->format('Y-m-d'),
        ]);

        // 5. Créer des budgets pour le mois actuel (YYYY-MM)
        foreach ($categoryCollection->where('name', '!=', 'Salaire')->take(4) as $cat) {
            Budget::create([
                'user_id' => $user->id,
                'category_id' => $cat->id,
                'amount' => rand(2000, 5000),
                'month' => now()->format('Y-m'), // Format string comme ta migration
            ]);
        }
    }
}
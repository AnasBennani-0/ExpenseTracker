<?php

namespace Database\Factories;

use App\Models\Categorie;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Categorie>
 */
class CategorieFactory extends Factory
{
    /**
     * Le nom du modèle correspondant.
     * Très important car ton modèle s'appelle 'Categorie' (français).
     */
    protected $model = Categorie::class;

    /**
     * Définition de l'état par défaut.
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement([
                'Nourriture', 'Transport', 'Loisirs', 
                'Santé', 'Shopping', 'Loyer', 
                'Salaire', 'Investissement'
            ]),
            'icon' => fake()->randomElement([
                'Utensils', 'Car', 'Gamepad', 
                'Heart', 'ShoppingBag', 'Home', 
                'DollarSign', 'TrendingUp'
            ]),
            'color' => fake()->hexColor(),
            'is_default' => "0",
            // Crée un utilisateur automatiquement si aucun n'est fourni
            'user_id' => User::factory(), 
        ];
    }
}
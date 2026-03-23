<?php

namespace Database\Factories;

use App\Models\Budget;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Budget>
 */
class BudgetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Budget::class;
    public function definition(): array
    {
        return [
            'amount' => fake()->randomFloat(2, 1000, 5000),
            'month' => now()->format('Y-m'),
            'category_id' => \App\Models\Categorie::factory(),
            'user_id' => \App\Models\User::factory(),
        ];
    }
}

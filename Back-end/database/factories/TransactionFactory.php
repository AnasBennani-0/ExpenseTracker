<?php

namespace Database\Factories;

use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */

class TransactionFactory extends Factory
{
    // C'est important de dire à quelle classe cette factory est liée
    protected $model = Transaction::class;

    public function definition(): array
    {
        return [
            'amount' => fake()->randomFloat(2, 10, 5000), 
            'date' => fake()->dateTimeBetween('-1 year', 'now')->format('Y-m-d'), 
            'category_id' => fake()->numberBetween(1, 5), 
            'type' => fake()->randomElement(['expense', 'income']), 
            'note' => fake()->sentence(4), 
            'user_id' => 4, // ID de ton utilisateur de test
        ];
    }
}


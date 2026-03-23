<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Budget extends Model
{
    protected $fillable = ['user_id', 'category_id', 'amount', 'month'];

    use HasFactory;
    public function category(): BelongsTo
    {
        return $this->belongsTo(Categorie::class, 'category_id');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Categorie extends Model
{
    use HasFactory;
    protected $fillable = [
            'id',
            'user_id',
            'name',
            'icon',
            'color',
            'is_default'
    ];
}

<?php

namespace App\Models;

use App\Enums\TodoStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'status', 'category_id'];

    protected $casts = [
        'status' => TodoStatus::class,
    ];

    public function category()
    {
        return belongsTo(Category::class);
    }
}

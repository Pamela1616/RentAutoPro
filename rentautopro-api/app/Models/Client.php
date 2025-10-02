<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'full_name',
        'document_id',
        'phone',
        'email',
        'address',
    ];

    public function rentals(): HasMany
    {
        return $this->hasMany(Rental::class);
    }
}

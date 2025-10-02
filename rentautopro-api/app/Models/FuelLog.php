<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FuelLog extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'vehicle_id',
        'date',
        'km',
        'liters',
        'cost',
        'fuel_station',
    ];

    protected $casts = [
        'date' => 'date',
        'km' => 'integer',
        'liters' => 'decimal:2',
        'cost' => 'decimal:2',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }
}

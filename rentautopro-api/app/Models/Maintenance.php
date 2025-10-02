<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Maintenance extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'vehicle_id',
        'type',
        'description',
        'cost',
        'km_at_maintenance',
        'scheduled_date',
        'completed_date',
        'status',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
        'km_at_maintenance' => 'integer',
        'scheduled_date' => 'date',
        'completed_date' => 'date',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }
}

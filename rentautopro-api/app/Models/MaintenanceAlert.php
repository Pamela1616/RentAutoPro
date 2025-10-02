<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaintenanceAlert extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'vehicle_id',
        'alert_type',
        'threshold_value',
        'last_alert_date',
        'is_active',
    ];

    protected $casts = [
        'threshold_value' => 'integer',
        'last_alert_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }
}

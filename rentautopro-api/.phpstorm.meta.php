<?php

namespace PHPSTORM_META {

    override(\Illuminate\Support\Facades\Auth::user(), map([
        '' => \App\Models\User::class,
    ]));

    override(\Illuminate\Http\Request::user(), map([
        '' => \App\Models\User::class,
    ]));

    expectedArguments(
        \App\Models\User::createToken(),
        0,
        'auth_token'
    );
}

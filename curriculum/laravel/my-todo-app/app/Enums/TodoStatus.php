<?php
namespace App\Enums;

enum TodoStatus: int
{
    case Todo = 0;
    case Doing = 1;
    case Done = 2;
}

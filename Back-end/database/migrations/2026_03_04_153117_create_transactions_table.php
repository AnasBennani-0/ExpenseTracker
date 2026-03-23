<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        schema::disableForeignKeyConstraints();
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['expense', 'income']);
            $table->decimal("amount");
            $table->date("date");
            $table->text("note")->nullable();
            $table->timestamps();
            $table->foreignId("user_id")->constrained("users","id");
            $table->foreignId("category_id")->constrained("categories","id");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
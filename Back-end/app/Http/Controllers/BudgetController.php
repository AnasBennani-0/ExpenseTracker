<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Transaction; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BudgetController extends Controller
{
    public function index()
    {
        $budgets = Budget::where('user_id', Auth::id())->with('category')->get();

        $budgets = $budgets->map(function ($budget) {
            
            // Extraction propre de l'année et du mois
            $year = date('Y', strtotime($budget->month));
            $month = date('m', strtotime($budget->month));

            // Calcul SQL ultra-précis
            $spent = Transaction::where('user_id', Auth::id())
                ->where('category_id', $budget->category_id)
                ->where('type', 'expense')
                ->whereYear('date', $year)   
                ->whereMonth('date', $month) 
                ->sum('amount');

            // Force Laravel à inclure 'spent' dans le JSON
            $budget->setAttribute('spent', (float) $spent);
            
            return $budget;
        });

        return response()->json($budgets);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'amount' => 'required|numeric',
            'month' => 'required|string',
        ]);
    
        $budget = Budget::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'category_id' => $validated['category_id'],
                'month' => $validated['month']
            ],
            [
                'amount' => $validated['amount']
            ]
        );
    
        $budget->load('category');

        $year = date('Y', strtotime($budget->month));
        $month = date('m', strtotime($budget->month));

        $spent = Transaction::where('user_id', Auth::id())
                ->where('category_id', $budget->category_id)
                ->where('type', 'expense')
                ->whereYear('date', $year)
                ->whereMonth('date', $month)
                ->sum('amount');

        $budget->setAttribute('spent', (float) $spent);

        return response()->json($budget, 201);
    }

    public function update(Request $request, $id)
    {
        $budget = Budget::where('user_id', Auth::id())->findOrFail($id);
        $budget->update($request->all());
        
        $budget->load('category');

        $year = date('Y', strtotime($budget->month));
        $month = date('m', strtotime($budget->month));

        $spent = Transaction::where('user_id', Auth::id())
                ->where('category_id', $budget->category_id)
                ->where('type', 'expense')
                ->whereYear('date', $year)
                ->whereMonth('date', $month)
                ->sum('amount');

        $budget->setAttribute('spent', (float) $spent);

        return response()->json($budget);
    }

    public function destroy($id)
    {
       $budget = Budget::where('user_id', Auth::id())->findOrFail($id);
       $budget->delete();
       
       return response()->json(['id' => $id]);
    }
}
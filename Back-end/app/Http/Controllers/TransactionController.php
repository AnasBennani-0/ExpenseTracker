<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TransactionController extends Controller
{

    public function index(Request $request)
    {
        
            $query=Transaction::where('user_id',Auth::id());
            
            if ($request->filled('category_id') && $request->category_id !== 'all') {
                $query->where('category_id', $request->category_id);
            }
            if ($request->filled('type') && $request->type !== 'all') {
                $query->where('type', $request->type);
            }
            if ($request->filled('start_date') && $request->filled('end_date')) {
                $query->whereBetween('date', [$request->start_date, $request->end_date]);
            }
            if ($request->filled('note')) {
                $query->where('note', 'like', '%' . $request->note . '%');
            }
            
            $transactions = $query->orderBy('date', 'desc')->paginate(7);

             return response()->json($transactions);
    }


    public function store(Request $req)
    {
       $valid=$req->validate([
        'type' => 'required|in:expense,income',
        'amount'=>'required|numeric',
        'category_id'=>'required|exists:categories,id',
        'date' => 'required|date',
        'note' => 'nullable|string'
       ]);
       
       $valid['user_id'] = Auth::id();
       
       $transaction=Transaction::create($valid);
       return response()->json($transaction,201);
    }
    
    public function update(Request $request, $id)
    {
        $transaction = Transaction::where('user_id', Auth::id())->findOrFail($id);
        $transaction->update($request->all());
        return response()->json($transaction);
    }
    
    public function destroy($id)
    {
        $transaction = Transaction::where('user_id',Auth::id())->findOrFail($id);
        $transaction->delete();
       return response()->json(['id'=>$id],200);
    }
    
    public function getDashboardStats()
    {
        try {
            $userId = Auth::id();

            // 1. Totaux globaux
            $totalIncome = (float) Transaction::where('user_id', $userId)->where('type', 'income')->sum('amount');
            $totalExpense = (float) Transaction::where('user_id', $userId)->where('type', 'expense')->sum('amount');
            $balance = $totalIncome - $totalExpense;

            // Change cette ligne (ajoute 'transactions.' devant user_id)
            $expensesByCategory = Transaction::where('transactions.user_id', $userId) 
            ->where('transactions.type', 'expense')
            ->join('categories', 'transactions.category_id', '=', 'categories.id')
            ->selectRaw('categories.name as category, SUM(transactions.amount) as total')
            ->groupBy('categories.id', 'categories.name') // <-- Ajoute bien categories.id ici
            ->get();

            // 3. Bar Chart (Dépenses des 6 derniers mois)
            $monthsFr = [1 => 'Jan', 2 => 'Fév', 3 => 'Mar', 4 => 'Avr', 5 => 'Mai', 6 => 'Juin', 7 => 'Juil', 8 => 'Août', 9 => 'Sep', 10 => 'Oct', 11 => 'Nov', 12 => 'Déc'];
            $barChartData = [];
            
            // On génère le squelette des 6 derniers mois
            for ($i = 5; $i >= 0; $i--) {
                $date = \Carbon\Carbon::now()->subMonths($i);
                $barChartData[] = [
                    'month' => $monthsFr[$date->month],
                    'monthKey' => $date->month,
                    'yearKey' => $date->year,
                    'total' => 0
                ];
            }

            // On récupère les dépenses des 6 derniers mois
            $last6MonthsExpenses = Transaction::where('user_id', $userId)
                ->where('type', 'expense')
                ->where('date', '>=', \Carbon\Carbon::now()->subMonths(5)->startOfMonth())
                ->get();

            // On remplit notre squelette avec les vrais totaux
            foreach ($barChartData as &$data) {
                $data['total'] = (float) $last6MonthsExpenses->filter(function($t) use ($data) {
                    $tDate = \Carbon\Carbon::parse($t->date);
                    return $tDate->month === $data['monthKey'] && $tDate->year === $data['yearKey'];
                })->sum('amount');
            }

            // 4. Line Chart (Évolution du solde global)
            $allTransactions = Transaction::where('user_id', $userId)
                ->orderBy('date', 'asc')
                ->get();

            $chartDataLine = [];
            $currentBalance = 0;

            foreach ($allTransactions as $t) {
                $amount = (float) $t->amount;
                if ($t->type === 'income') {
                    $currentBalance += $amount;
                } else {
                    $currentBalance -= $amount;
                }
                
                // On stocke par date. S'il y a 3 transactions le même jour, on garde le solde final de la journée !
                $chartDataLine[$t->date] = [
                    'date' => $t->date,
                    'balance' => $currentBalance
                ];
            }

            return response()->json([
                'totalIncome' => $totalIncome,
                'totalExpense' => $totalExpense,
                'balance' => $balance,
                'chartData' => $expensesByCategory,
                'barChartData' => array_values($barChartData), // Pour React
                'chartDataLine' => array_values($chartDataLine) // Pour React
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'erreur_exacte' => $e->getMessage(),
                'ligne' => $e->getLine()
            ], 500);
        }
    }
   
}
    
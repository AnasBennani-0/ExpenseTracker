import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Pie, PieChart, Cell, Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ArrowUpRight, ArrowDownRight, Wallet, Activity, TrendingUp, BarChart3, LineChart } from "lucide-react";
import { fetchDashboardStats } from "../store/TransSlice";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "../../components/ui/card";
import {
  ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent,
} from "../../components/ui/chart";

export default function Dash() {
  const dispatch = useDispatch();
  

  const stats = useSelector((st) => st.transaction.stats);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);


  const chartDataWithColors = useMemo(() => {
    return stats?.chartData?.map((item, index) => ({
      category: item.category,
      amount: parseFloat(item.total),
      fill: `var(--chart-${(index % 5) + 1})`,
    })) || [];
  }, [stats]);

  const chartConfig = useMemo(() => {
    return stats?.chartData?.reduce((acc, item, index) => {
      acc[item.category] = {
        label: item.category,
        color: `var(--chart-${(index % 5) + 1})`,
      };
      return acc;
    }, { amount: { label: "Montant (DH)" } }) || {};
  }, [stats]);

  
  const barChartData = stats?.barChartData || [];
  const chartDataLine = stats?.chartDataLine || [];

  const lineConfig = {
    balance: { label: "Solde (DH)", color: "var(--primary)" },
  };

  const barConfig = {
    total: { label: "Dépenses (DH)", color: "var(--chart-1)" },
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
     
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 rounded-2xl ring-1 ring-primary/20">
          <Activity className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
            Aperçu Financier
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Suivez vos performances et analysez vos dépenses en temps réel.
          </p>
        </div>
      </div>

   
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
    
        <div className="group relative bg-card p-6 rounded-3xl border border-border shadow-sm hover:shadow-lg hover:shadow-green-500/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-green-500/10 text-green-500 rounded-2xl ring-1 ring-green-500/20">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500/50" />
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Revenus Totaux</p>
              <p className="text-3xl font-extrabold text-foreground">
                +{Number(stats?.totalIncome || 0).toLocaleString()} <span className="text-lg text-muted-foreground font-medium">DH</span>
              </p>
            </div>
          </div>
        </div>

        {/* DÉPENSES */}
        <div className="group relative bg-card p-6 rounded-3xl border border-border shadow-sm hover:shadow-lg hover:shadow-red-500/5 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
          <div className="relative flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl ring-1 ring-red-500/20">
                <ArrowDownRight className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Dépenses Totales</p>
              <p className="text-3xl font-extrabold text-foreground">
                -{Number(stats?.totalExpense || 0).toLocaleString()} <span className="text-lg text-muted-foreground font-medium">DH</span>
              </p>
            </div>
          </div>
        </div>

        {/* SOLDE */}
        <div className="group relative p-6 rounded-3xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-gradient-to-br from-primary via-primary to-blue-600 border border-white/10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,white/10_50%,transparent_100%)] -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000"></div>
          <div className="relative flex flex-col gap-4">
            <div className="p-3 bg-white/20 text-white rounded-2xl w-max backdrop-blur-sm ring-1 ring-white/30">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white/80 uppercase tracking-wider mb-1">Solde Actuel</p>
              <p className="text-4xl font-black text-white tracking-tight">
                {Number(stats?.balance || 0).toLocaleString()} <span className="text-xl font-medium opacity-80">DH</span>
              </p>
            </div>
          </div>
        </div>
      </div>

     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        
       
        <Card className="flex flex-col bg-card/50 backdrop-blur-xl border-border/60 shadow-lg rounded-3xl overflow-hidden">
          <CardHeader className="items-center pb-2 pt-8 border-b border-border/40 bg-muted/20">
            <CardTitle className="text-xl font-extrabold text-foreground">Répartition des Dépenses</CardTitle>
            <CardDescription className="text-muted-foreground font-medium">Toutes catégories confondues</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-8 mt-6">
            {chartDataWithColors.length > 0 ? (
              <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[350px]">
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel className="bg-background/95 backdrop-blur-md border-border shadow-xl rounded-xl" />} />
                  <Pie
                    data={chartDataWithColors}
                    dataKey="amount"
                    nameKey="category"
                    innerRadius={75}
                    outerRadius={110}
                    strokeWidth={4}
                    stroke="var(--background)"
                    paddingAngle={5}
                    className="transition-all duration-300 hover:opacity-90"
                  >
                    {chartDataWithColors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="category" />} className="flex-wrap justify-center gap-3 mt-8" />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="flex flex-col h-64 items-center justify-center text-muted-foreground animate-pulse">
                <PieChart className="w-16 h-16 opacity-20 mb-4" />
                <p className="font-medium text-lg text-foreground/50">Aucune dépense enregistrée.</p>
              </div>
            )}
          </CardContent>
        </Card>

  
        <Card className="flex flex-col bg-card/50 backdrop-blur-xl border-border/60 shadow-lg rounded-3xl overflow-hidden">
          <CardHeader className="pb-4 pt-8 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-extrabold text-foreground">Dépenses Mensuelles</CardTitle>
              <CardDescription className="text-muted-foreground font-medium mt-1">6 derniers mois</CardDescription>
            </div>
            <div className="p-2 bg-primary/10 text-primary rounded-xl ring-1 ring-primary/20">
              <BarChart3 className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <ChartContainer config={barConfig} className="h-[300px] w-full">
              <BarChart data={barChartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-muted-foreground text-xs uppercase font-semibold" />
                <ChartTooltip content={<ChartTooltipContent className="bg-background/95 backdrop-blur-md border-border shadow-xl rounded-xl" />} cursor={{ fill: 'var(--muted)', opacity: 0.2 }} />
                <Bar dataKey="total" fill="var(--chart-1)" radius={[6, 6, 0, 0]} className="hover:opacity-80 transition-opacity" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      
      <div className="grid grid-cols-1 mt-6">
       
        <Card className="flex flex-col bg-card/50 backdrop-blur-xl border-border/60 shadow-lg rounded-3xl overflow-hidden">
          <CardHeader className="pb-4 pt-8 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between">
             <div>
              <CardTitle className="text-xl font-extrabold text-foreground">Évolution du Solde</CardTitle>
              <CardDescription className="text-muted-foreground font-medium mt-1">Historique de votre balance</CardDescription>
            </div>
            <div className="p-2 bg-primary/10 text-primary rounded-xl ring-1 ring-primary/20">
              <LineChart className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <ChartContainer config={lineConfig} className="h-[350px] w-full">
              <AreaChart data={chartDataLine}>
                <defs>
                  <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(v) => new Date(v).toLocaleDateString('fr-FR', {day:'numeric', month:'short'})} 
                  className="text-muted-foreground text-xs font-semibold"
                />
                <ChartTooltip content={<ChartTooltipContent className="bg-background/95 backdrop-blur-md border-border shadow-xl rounded-xl" />} />
                <Area 
                  dataKey="balance" 
                  type="monotone" 
                  fill="url(#fillBalance)" 
                  stroke="var(--primary)" 
                  strokeWidth={3} 
                  activeDot={{ r: 6, strokeWidth: 0, fill: "var(--primary)" }}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
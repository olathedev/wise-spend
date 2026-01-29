import Header from '@/components/layout/Header';
import FinancialSummaryCards from '@/components/dashboard/FinancialSummaryCards';
import TransactionList from '@/components/dashboard/TransactionList';
import SocraticCoach from '@/components/dashboard/SocraticCoach';
import FinancialResilienceChart from '@/components/dashboard/FinancialResilienceChart';

export default function DashboardPage() {
  return (
    <>
      <Header />
      <FinancialSummaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <TransactionList />
        <SocraticCoach />
      </div>
      <FinancialResilienceChart />
    </>
  );
}

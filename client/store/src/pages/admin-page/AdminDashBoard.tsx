import { useEffect, useState } from "react"
import ProfitChart from "../../components/profits/ProfitChart"

import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/store"
import { fetchProfitsData } from "../../redux/admin/profits/ProfitsThunk"
import { dummyMonthlyData, dummyWeeklyData, dummyYearlyData  } from "./dummyData"
// import type {SalesDataWithProfit} from "./dummyData"
import type { SalesData } from "../../redux/admin/profits/types"

const AdminDashBoard = () => {

  const dispatch = useDispatch<AppDispatch>();

  const { weekly, monthly, yearly, loading, error } = useSelector((state: RootState) => state.profits);
  const [weeklyData, setWeeklyData] = useState<SalesData[]>(weekly);
  const [monthlyData, setMonthlyData] = useState<SalesData[]>(monthly);
  const [yearlyData, setYearlyData] = useState<SalesData[]>(yearly);

  useEffect(() => {
    if(!weekly){
      setWeeklyData(dummyWeeklyData)
    }
    if(!monthly){
      setMonthlyData(dummyMonthlyData)
    }
    if(!yearly){
      setYearlyData(dummyYearlyData)
    }
    dispatch(fetchProfitsData());
  }, [dispatch]);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="text-center mt-8 ">
        <h1>Welcome Boss!</h1>
        <ProfitChart weekly={weeklyData} monthly={monthlyData} yearly={yearlyData}/>
    </div>
  )
}

export default AdminDashBoard
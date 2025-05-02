import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useSelector } from "react-redux";

const GradesPieChart  = () => {
  const [series, setSeries] = useState([8, 10, 4, 2, 5]);
  const {studentStats} = useSelector((state) => state.user);

  useEffect(() => {
    if (studentStats?.grade_counts) {
      const gradeCountsArray = ["A", "B", "C", "D", "E"].map(
        (grade) => studentStats.grade_counts[grade] || 0
      );
      setSeries(gradeCountsArray);
    }
  }, [studentStats]);

  const chartOptions = {
    chart: {
      width: 570,
    },
    labels: [
      "A",
      "B",
      "C",
      "D",
      "E"
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
            type: "pie",
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div id='chart'>
      <h2 className='text-gray-600 text-sm'>
        Perfomance Distribution Based on Grades
      </h2>
      <ReactApexChart
        options={chartOptions}
        series={series}
        type='pie'
        width={400}
        height={400}
        className='usage-chart'
      />
    </div>
  );
};

export default GradesPieChart;
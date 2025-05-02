import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useSelector } from "react-redux";

const YearStats = () => {
  const { studentStats } = useSelector((state) => state.user);

  const [semesterAverages, setSemesterAverages] = useState({
    semesterNames: [],
    averageScores: [],
  });

  const options = {
    chart: {
      id: "apexchart-example",
    },
    xaxis: {
      categories: semesterAverages?.semesterNames,
    },
  };

  const series = [
    {
      name: "Score",
      data: semesterAverages?.averageScores,
    },
  ];

  useEffect(() => {
    if (studentStats?.semester_averages) {
      // Extract semester names and average scores
      const semesterNames = studentStats.semester_averages.map(
        (semester) => semester.semester
      );
      const averageScores = studentStats.semester_averages.map(
        (semester) => semester.avg_score
      );

      // Update state with extracted data
      setSemesterAverages({
        semesterNames: semesterNames,
        averageScores: averageScores,
      });
    }
  }, [studentStats]);

  return (
    <>
      <h2 className='text-gray-600 text-sm'>
        Perfomance Distribution by Academic Year
      </h2>
      <Chart
        options={options}
        series={series}
        type='bar'
        width={500}
        height={320}
      />
    </>
  );
};

export default YearStats;

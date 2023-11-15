import { BarChart } from '@mui/x-charts';
import React from 'react';

export default function Charts({ list }) {
  return (
    <div className="chart-container">
      <BarChart
        xAxis={[
          {
            id: 'barCategories',
            data: ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            scaleType: 'band',
          },
        ]}
        series={[
          {
            data: list,
          },
        ]}
        width={700}
        height={500}
        margin={{ right: 110, bottom: 50, left: 100 }}
      />
    </div>
  );
}

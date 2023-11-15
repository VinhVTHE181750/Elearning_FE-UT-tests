import { BarChart } from '@mui/icons-material';
import React from 'react';

export default function Charts({ list }) {
  return (
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
      width={500}
      height={300}
    />
  );
}
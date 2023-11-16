import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import authApi from '../api/authApi';

const BarChartPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    authApi
      .getPaymentByMonthYear({ month: 10, year: 2022 })
      .then((response) => {
        console.log('response: ', response);
        if (response.code === 0) {
          setData([{ name: 'Revenue', revenue: response.data.revenue }]);
        } else {
          // Handle error
        }
      })
      .catch((error) => {
        // Handle error
      });
  }, []);

  useEffect(() => {
    const revenue = 100000000;
    const courseId = '13';
    const month = 10;
    const year = 2022;

    authApi
      .getPaymentByCourse({ revenue, courseId, month, year })
      .then((response) => {
        console.log('response: ', response);
        if (response.code === 0) {
          setData([{ name: 'Revenue', revenue: response.data.revenue }]);
        } else {
          // Handle error
        }
      })
      .catch((error) => {
        // Handle error
      });
  }, []);

  return (
    <div>
      <h1>Bar Chart Page</h1>
      <ResponsiveBar
        data={data}
        keys={['revenue']}
        indexBy="name"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: 'nivo' }}
        defs={[
          {
            id: 'dots',
            type: 'patternDots',
            background: 'inherit',
            color: '#38bcb2',
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: 'lines',
            type: 'patternLines',
            background: 'inherit',
            color: '#eed312',
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        fill={[
          {
            match: {
              id: 'revenue',
            },
            id: 'dots',
          },
        ]}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Revenue',
          legendPosition: 'middle',
          legendOffset: 32,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Name',
          legendPosition: 'middle',
          legendOffset: -40,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  );
};

export default BarChartPage;

import GeneralChart from 'components/UI/Charts';
import React from 'react'

type Props = {}

const DashboardDayGraph = (props: Props) => {
  return (
    <>
      <GeneralChart
        minHeight={350}
        options={{
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          legend: {
            show: true,
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            top: "8%",
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: 'Customers',
              data: [45, 52, 57, 66, 60, 54, 48],
              type: 'line',
              smooth: true
            },
            {
              name: 'Products',
              data: [20, 25, 20, 25, 20, 25, 20],
              type: 'line',
              smooth: true
            },
            {
              name: 'Suppliers',
              data: [25, 20, 25, 20, 25, 20, 25],
              type: 'line',
              smooth: true
            }
          ]
        }}
      />
    </>
  )
}

export default DashboardDayGraph;
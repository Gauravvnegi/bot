export type CircularChart = {
    labels: string[];
    data: CircularData[];
    type: string;
    options: any;
    legend: any;
};

// export type Options = {
//     responsive: boolean;
//     legend: Legend,
// }

// export type Legend = {
//     display: boolean;
//     position: string;
// }


export type CircularData = {
    data: any[],
    backgroundColor: string[],
}

export type BarChart = {
  labels: string[];
  data: Bar[];
  type: string;
  options: any;
};

export type Bar = {
  data: any[];
  label: string;
  fill?: boolean;
  backgroundColor?: string;
  borderColor?: string,
  hoverBorderColor?: string,
  borderWidth?: number,
  barThickness?: number,
};
  
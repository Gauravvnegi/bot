export const dashboard = {
  images: {
    arrivals: {
      headerIcon: {
        url: 'assets/svg/arrivals_icon.svg',
        alt: 'Arrivals',
      },
    },
    departures: {
      headerIcon: {
        url: 'assets/svg/departure.svg',
        alt: 'Departure',
      },
    },
    bookingStatus: {
      headerIcon: {
        url: 'assets/svg/booking-status.svg',
        alt: 'Booking-status',
      },
    },
    reservationStat: {
      headerIcon: { url: 'assets/svg/Reservation.svg', alt: 'Reservation' },
    },
    inhouse: {
      headerIcon: { url: 'assets/svg/inhouse.svg', alt: 'Inhouse' },
    },
    messages: {
      headerIcon: { url: 'assets/svg/Messages.svg', alt: 'Messages' },
    },
    notification: {
      headerIcon: { url: 'assets/svg/Notifications.svg', alt: 'Notification' },
    },
    info: { url: 'assets/svg/info.svg', alt: 'Info' },
    download: { url: 'assets/svg/Download.svg', alt: 'Download' },
    googleDoc: { url: 'assets/svg/google-docs.svg', alt: 'Google Doc' },
    card: { url: 'assets/svg/card.svg', alt: 'Card' },
    export: { url: 'assets/svg/Export.svg', alt: 'Export' },
    csv: { url: 'assets/svg/CSV.svg', alt: 'CSV' },
    filter: { url: 'assets/svg/Filter-Icon.svg', alt: 'Filter' },
    document: { url: 'assets/svg/Document.svg', alt: 'Document' },
    payment: { url: 'assets/svg/Payment.svg', alt: 'Payment' },
    feedback: { url: 'assets/svg/Feedback.svg', alt: 'Feedback' },
    newJourney: { url: 'assets/svg/New-Journey.svg', alt: 'New-Journey' },
    preCheckin: { url: 'assets/svg/precheckin.svg', alt: 'Pre-checkin' },
    checkin: { url: 'assets/svg/checkin.svg', alt: 'Checkin' },
    checkout: { url: 'assets/svg/checkout.svg', alt: 'Checkout' },
    adult: { url: 'assets/svg/stat-adult.svg', alt: 'Adult' },
    kids: { url: 'assets/svg/stat-child.svg', alt: 'Kids' },
  },
  legend: {
    bookingStatus: [
      {
        label: 'Check-In',
        borderColor: '#0ea47a',
        backgroundColor: '#0ea47a',
      },
      {
        label: 'Checkout',
        borderColor: '#ff4545',
        backgroundColor: '#ff4545',
      },
    ],
  },
  chart: {
    option: {
      bookingStatus: {
        responsive: true,
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: true,
              },
              ticks: {
                min: 0,
                stepSize: 1,
              },
            },
          ],
        },
        tooltips: {
          backgroundColor: 'white',
          bodyFontColor: 'black',
          borderColor: '#f4f5f6',
          borderWidth: 3,
          titleFontColor: 'black',
          titleMarginBottom: 5,
          xPadding: 10,
          yPadding: 10,
        },
      },
      inhouse: {
        tooltips: {
          backgroundColor: 'white',
          bodyFontColor: 'black',
          borderColor: '#f4f5f6',
          borderWidth: 3,
          titleFontColor: 'black',
          titleMarginBottom: 5,
          xPadding: 10,
          yPadding: 10,
        },
        responsive: true,
        elements: {
          center: {
            text: '401',
            text3: 'Total Users',
            fontColor: '#000',
            fontFamily: "CalibreWeb, 'Helvetica Neue', Arial ",
            fontSize: 36,
            fontStyle: 'normal',
          },
        },
        cutoutPercentage: 75,
      },
      reservation: {
        tooltips: {
          backgroundColor: 'white',
          bodyFontColor: 'black',
          borderColor: '#f4f5f6',
          borderWidth: 3,
          titleFontColor: 'black',
          titleMarginBottom: 5,
          xPadding: 10,
          yPadding: 10,
        },
        responsive: true,
        cutoutPercentage: 75,
      },
    },
    color: {
      bookingStatus: [
        {
          borderColor: '#0ea47a',
        },
        {
          borderColor: '#ff4545',
        },
      ],
      inhouseRequest: [
        {
          backgroundColor: ['#52B33F', '#E0E0E0', '#CC052B'],
          borderColor: ['#52B33F', '#E0E0E0', '#CC052B'],
        },
      ],
      inhouse: [
        {
          backgroundColor: ['#4BA0F5', '#FFBF04'],
          borderColor: ['#4BA0F5', '#FFBF04'],
        },
      ],
    },
    labels: {
      inhouseRequest: [
        'Request Completed',
        'Request Pending',
        'Request Timeout',
      ],
      inhouse: ['Kid', 'Adult'],
    },
  },
  table: {
    arrivals: {
      name: 'Arrivals',
    },
    departures: {
      name: 'Departures',
    },
    inhouse: {
      name: 'In-House',
    },
  },
};

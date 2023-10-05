export const productMenuSubs: any[] = [
  {
    label: 'efrontdesk',
    name: 'FRONT_DESK',
    icon: 'assets/images/efrontdesk.png',
    isSubscribed: true,
    isView: true,
    config: [
      {
        name: 'FRONT_DESK_HOME',
        label: 'Home',
        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/FrontDesk.svg',
        isSubscribed: true,
        isView: true,
        config: [
          {
            featureId: '951a6698-3850-4dca-bcfd-0a2a3b6859f4',
            name: 'FRONT_DESK_DASHBOARD',
            label: 'Dashboard',
            description:
              'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/Analytics.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
      },
      {
        name: 'MEMBERS',
        label: 'Members',
        description: 'Members Module',
        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/subscription_.svg',
        isSubscribed: true,
        isView: true,
        config: [
          {
            featureId: 'ed0d7a6e-1655-493b-84a2-2d90965328f6',
            name: 'GUESTS',
            label: 'Guest ',

            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/user.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
      },
      {
        name: 'FINANCE',
        label: 'Finance',
        description: 'Finance Module',
        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/money.svg',
        isSubscribed: true,
        isView: true,

        config: [
          {
            featureId: '4164c823-ea1f-427a-ac63-8885f25a7012',
            name: 'INVOICE',
            label: 'Invoice',

            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/subscription_.svg',
            isSubscribed: false,
            isView: true,
          },
          {
            featureId: '4264c823-ea1f-427a-ac63-8885f25a7012',
            name: 'TRANSACTIONS',
            label: 'Transaction',
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/subscription_.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
      },
      {
        name: 'LIBRARY',
        label: 'Library',

        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/library.svg',
        isSubscribed: true,
        isView: true,
        config: [
          {
            featureId: '3211f5fe-f482-49a9-ba02-230c6c802b0c',
            name: 'OFFERS',
            label: 'Offers',

            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/box.svg',
            isSubscribed: false,
            isView: true,
          },
          {
            featureId: 'eb78d39a-5000-45b7-a75f-05d273ca9980',
            name: 'PACKAGES',
            label: 'Packages',

            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/box.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '8e9b7a06-aad9-435e-b338-2c2d42882396',
            name: 'SERVICES',
            label: 'Services',

            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/box.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
      },
      {
        name: 'SETTINGS',
        label: 'Settings',
        description: 'Compare website plans and upgrade your subscription.',
        icon:
          'https://botfiles.nyc3.cdn.digitaloceanspaces.com/bot/subscription_icon/settings.png',
        config: [
          {
            featureId: '5472e19d-b819-4bf7-8397-59d4b09799cb',
            name: 'BUSINESS_INFO',
            label: 'Business info',
            description:
              'Set your business name, logo, location and contact info.',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://botfiles.nyc3.cdn.digitaloceanspaces.com/bot/subscription_icons/briefcase.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: 'c0945b71-a173-4818-b1f4-1527547accd5',
            name: 'WEBSITE_SETTINGS',
            label: 'Website settings',
            description: 'Manage your site’s name, URL, favicon and more.',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://botfiles.nyc3.cdn.digitaloceanspaces.com/bot/subscription_icons/internet.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: 'b9e74d5d-13ee-400c-96ce-f6cb06f07992',
            name: 'ACCEPT_PAYMENTS',
            label: 'Accept payments',
            description: 'Choose the way you get paid by customers.',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://botfiles.nyc3.cdn.digitaloceanspaces.com/bot/subscription_icons/dollar-currency-symbol.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: 'fd0769c2-7170-4108-9b75-5b6d176fc285',
            name: 'NOTIFICATION',
            label: 'Notifications',
            description: 'Choose which notifications you get from us.',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://botfiles.nyc3.cdn.digitaloceanspaces.com/bot/subscription_icons/bell-setting.svg',
            isSubscribed: true,
            isView: false,
          },
          {
            featureId: '51679c45-2aa6-439f-a345-f52ea16b9673',
            name: 'SUBSCRIPTION',
            label: 'Subscription',
            description: 'Compare website plans and upgrade your subscription.',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://botfiles.nyc3.cdn.digitaloceanspaces.com/bot/subscription_icons/businessman.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '8051d7ff-58e2-435a-8bd0-7ce8795acb92',
            name: 'ROLES_AND_PERMISSION',
            label: 'Roles & permissions',
            description:
              'Edit profiles, Add new users, Assign roles and permissions.',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://botfiles.nyc3.cdn.digitaloceanspaces.com/bot/subscription_icons/lock.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '31cacc76-3034-4ef3-90d4-5de81f02eb4c',
            name: 'LEGAL_POLICIES',
            label: 'Legal Policies',
            description: 'Streamline Privacy Policies and Terms of Usage',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://botfiles.nyc3.cdn.digitaloceanspaces.com/bot/subscription_icons/insurance.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '7c43c68c-bfcc-4b72-8884-aa669f755ccb',
            name: 'TAX',
            label: 'Tax',
            description: 'Effortlessly manage tax settings',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://botfiles.nyc3.cdn.digitaloceanspaces.com/bot/subscription_icons/taxes.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
        isSubscribed: true,
        isView: false,
      },
    ],
  },
  {
    label: 'Heda',
    name: 'HEDA',
    icon: 'assets/images/efrontdesk.png',
    isSubscribed: true,
    isView: true,
    config: [
      {
        name: 'HEDA_HOME',
        label: 'Home',
        description:
          'Never miss an opportunity to connect with guests by automating ',
        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/Heda.svg',
        isSubscribed: true,
        isView: true,
        config: [
          {
            featureId: '62f89549-928d-4cf7-9c9a-3140972166d2',
            name: 'HEDA_DASHBOARD',
            label: 'Dashboard',
            description:
              'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
            cost: {
              cost: 0.0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/Analytics.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            name: 'Heda Feedback',
            label: 'FEEDBACK',
            description:
              'Never miss an opportunity to connect with guests by automating ',
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/Heda.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
      },
      {
        name: 'FINANCE',
        label: 'Finance',
        description: 'Finance Module',
        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/money.svg',
        isSubscribed: true,
        isView: true,

        config: [
          {
            featureId: '4164c823-ea1f-427a-ac63-8885f25a7012',
            name: 'INVOICE',
            label: 'Invoice',

            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/subscription_.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '4264c823-ea1f-427a-ac63-8885f25a7012',
            name: 'TRANSACTIONS',
            label: 'Transaction',
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/subscription_.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
      },
      {
        name: 'MEMBERS',
        label: 'Members',
        description: 'Members Module',
        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/subscription_.svg',
        isSubscribed: true,
        isView: true,
        config: [
          {
            featureId: 'ed0d7a6e-1655-493b-84a2-2d90965328f6',
            name: 'GUESTS',
            label: 'Guest ',
            description:
              'Never miss an opportunity to connect with guests by automating ',
            cost: {
              cost: 0.0,
              usageLimit: 0,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/user.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
      },
    ],
  },
  {
    label: 'Freddie',
    name: 'FREDDIE',
    icon: 'assets/images/efrontdesk.png',
    isSubscribed: true,
    isView: true,
    config: [
      {
        name: 'FREDDIE_HOME',
        label: 'Home',
        description:
          'Never miss an opportunity to connect with guests by automating ',
        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/Freddie.svg',
        isSubscribed: true,
        isView: true,
        config: [
          {
            featureId: '26d1e01c-c5f6-4f19-8832-c83d3d60a710',
            name: 'CONVERSATION_DASHBOARD',
            label: 'Dashboard',
            description:
              'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/Analytics.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: 'd2648883-c9e8-48d5-8759-7a4c1eef0ebd',
            name: 'LIVE_MESSAGING',
            label: 'Messages',
            description:
              'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/chatting.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
      },
      {
        name: 'FINANCE',
        label: 'Finance',
        description: 'Finance Module',
        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/money.svg',
        isSubscribed: true,
        isView: true,

        config: [
          {
            featureId: '4164c823-ea1f-427a-ac63-8885f25a7012',
            name: 'INVOICE',
            label: 'Invoice',

            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/subscription_.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '4264c823-ea1f-427a-ac63-8885f25a7012',
            name: 'TRANSACTIONS',
            label: 'Transaction',
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/subscription_.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
      },
      {
        name: 'LIBRARY',
        label: 'Library',

        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/library.svg',
        isSubscribed: true,
        isView: true,
        config: [
          {
            featureId: '3211f5fe-f482-49a9-ba02-230c6c802b0c',
            name: 'OFFERS',
            label: 'Offers',

            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/box.svg',
            isSubscribed: false,
            isView: true,
          },
          {
            featureId: 'eb78d39a-5000-45b7-a75f-05d273ca9980',
            name: 'PACKAGES',
            label: 'Packages',

            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/box.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '8e9b7a06-aad9-435e-b338-2c2d42882396',
            name: 'SERVICES',
            label: 'Services',

            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/box.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
      },
    ],
  },
  {
    label: 'RevMaxi',
    name: 'REV_MAXI',
    icon: 'assets/images/createwith.png',
    isSubscribed: true,
    isView: true,
    config: [
      {
        name: 'REVENUE_MANAGER',
        label: 'Revenue Manager',
        description:
          'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
        icon:
          'https://botfiles.nyc3.cdn.digitaloceanspaces.com/subscription_icons/revenue_manager.svg',
        config: [
          {
            featureId: '2064c823-ea1f-427a-ac63-8885f25a7013',
            name: 'SETUP_BAR_PRICE',
            label: 'Setup Bar Price',
            description: 'Set up Bar Price',
            cost: {
              cost: 0.0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon: '',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '9064c823-ea1f-427a-ac63-8885f25a7012',
            name: 'DYNAMIC_PRICING',
            label: 'Dynamic Pricing',
            description: 'Dynamic Pricing',
            cost: {
              cost: 0.0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/subscription_.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
        isSubscribed: true,
        isView: true,
      },
      {
        name: 'FINANCE',
        label: 'Finance',
        description: 'Finance Module',
        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/money.svg',
        isSubscribed: true,
        isView: true,

        config: [
          {
            featureId: '4164c823-ea1f-427a-ac63-8885f25a7012',
            name: 'INVOICE',
            label: 'Invoice',

            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/subscription_.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '4264c823-ea1f-427a-ac63-8885f25a7012',
            name: 'TRANSACTIONS',
            label: 'Transaction',
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/subscription_.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
      },
      ,
      {
        name: 'LIBRARY',
        label: 'Library',

        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/library.svg',
        isSubscribed: true,
        isView: true,
        config: [
          {
            featureId: '3211f5fe-f482-49a9-ba02-230c6c802b0c',
            name: 'OFFERS',
            label: 'Offers',

            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/box.svg',
            isSubscribed: false,
            isView: true,
          },
          {
            featureId: 'eb78d39a-5000-45b7-a75f-05d273ca9980',
            name: 'PACKAGES',
            label: 'Packages',

            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/box.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '8e9b7a06-aad9-435e-b338-2c2d42882396',
            name: 'SERVICES',
            label: 'Services',

            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/box.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
      },
      {
        name: 'MEMBERS',
        label: 'Members',
        description: 'Members Module',
        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/subscription_.svg',
        isSubscribed: true,
        isView: true,
        config: [
          {
            featureId: 'ed0d7a6e-1655-493b-84a2-2d90965328f6',
            name: 'GUESTS',
            label: 'Guest ',
            description:
              'Never miss an opportunity to connect with guests by automating ',
            cost: {
              cost: 0.0,
              usageLimit: 0,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/user.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
      },
    ],
  },
  {
    name: 'CHANNEL_MANAGER',
    label: 'Channel Manager',
    description: 'Channel Manager',
    icon:
      'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/subscription_.svg',
    isSubscribed: true,
    isView: true,
    config: [
      {
        name: 'CHANNEL_MANAGER_HOME',
        label: 'Home',
        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/subscription_.svg',
        isSubscribed: true,
        isView: true,
        config: [
          {
            featureId: '7064c823-ea1f-427a-ac63-8885f25a7012',
            name: 'MANAGE_INVENTORY',
            label: 'Update Inventory',
            description: 'Update Inventory',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/subscription_.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '8064c823-ea1f-427a-ac63-8885f25a7012',
            name: 'MANAGE_RATE',
            label: 'Update Rates',
            description: 'Update Rate plans',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/subscription_.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            name: 'ROOM',
            label: 'Room',
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/library.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '2064c823-ea1f-427a-ac63-8885f25a7013',
            name: 'SETUP_BAR_PRICE',
            label: 'Setup Bar Price',
            description: 'Set up Bar Price',
            cost: {
              cost: 0.0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon: '',
            isSubscribed: true,
            isView: true,
          },
        ],
      },
    ],
  },
  ,
  {
    label: 'eMark-IT',
    name: 'EMARK_IT',
    icon: 'assets/images/hotel-in-box.png',
    isSubscribed: true,
    isView: true,
    config: [
      {
        name: 'eMARK_IT_HOME',
        label: 'Home',
        description:
          'eMARK_IT Product: Never miss an opportunity to connect with guests by automating ',
        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/marketing.svg',
        config: [
          {
            featureId: '07bdbd20-787e-4981-88b1-8edd54bf42aa',
            name: 'eMARK_IT_DASHBOARD',
            label: 'Analytics',
            description:
              'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/Analytics.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: 'bdc91fe3-0e02-491a-8308-6cb9ca97185e',
            name: 'CAMPAIGN',
            label: 'Campaign',
            description:
              'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/megaphone.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
        isSubscribed: true,
        isView: true,
      },
      {
        name: 'LIBRARY',
        label: 'Library',

        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/library.svg',
        isSubscribed: true,
        isView: true,
        config: [
          {
            featureId: '3211f5fe-f482-49a9-ba02-230c6c802b0c',
            name: 'OFFERS',
            label: 'Offers',

            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/box.svg',
            isSubscribed: false,
            isView: true,
          },
          {
            featureId: 'eb78d39a-5000-45b7-a75f-05d273ca9980',
            name: 'PACKAGES',
            label: 'Packages',

            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/box.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '8e9b7a06-aad9-435e-b338-2c2d42882396',
            name: 'SERVICES',
            label: 'Services',

            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/box.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
      },
    ],
  },
  {
    label: 'Createwith',
    name: 'CREATE_WITH',
    icon: 'assets/images/hotel-in-box.png',
    isSubscribed: true,
    isView: true,
    config: [
      {
        name: 'CREATE_WITH_HOME',
        label: 'Home',
        description:
          'Website Content Management System //\nWebsite Builder: Never miss an opportunity to connect with guests by automating ',
        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/createWithIcon.svg',
        config: [
          {
            featureId: '9a640e0f-6504-4093-90f9-2aa4ec8a8efd',
            name: 'CREATE_WITH_DASHBOARD',
            label: 'Dashboard',
            description:
              'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/Analytics.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '8f709f2d-69d7-4d69-9e84-e7deb5dccda8',
            name: 'THEME',
            label: 'Theme',
            description:
              'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/library.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '5826881c-be76-46ca-bd78-e743037531fd',
            name: 'PAGES',
            label: 'Pages',
            description:
              'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/library.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '4f5eb9b2-f755-4a6d-94df-2482d60ed410',
            name: 'BLOG',
            label: 'Blog',
            description:
              'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/library.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '3835e394-ee7c-497b-9d37-f4d548345b59',
            name: 'MARKETING_SEO',
            label: 'Marketing & SEO',
            description:
              'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/builder.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
        isSubscribed: true,
        isView: true,
      },
      {
        name: 'MEMBERS',
        label: 'Members',
        description: 'Members Module',
        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/subscription_.svg',
        config: [
          {
            featureId: 'ed0d7a6e-1655-493b-84a2-2d90965328f6',
            name: 'GUESTS',
            label: 'Guest ',
            description:
              'Never miss an opportunity to connect with guests by automating ',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 446,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/user.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
        isSubscribed: true,
        isView: true,
      },
      {
        name: 'LIBRARY',
        label: 'Library',
        description:
          'Never miss an opportunity to connect with guests by automating ',
        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/library.svg',
        config: [
          {
            featureId: '3211f5fe-f482-49a9-ba02-230c6c802b0c',
            name: 'OFFERS',
            label: 'Offers',
            description:
              'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/box.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '8e9b7a06-aad9-435e-b338-2c2d42882396',
            name: 'SERVICES',
            label: 'Services',
            description:
              'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/box.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: 'eb78d39a-5000-45b7-a75f-05d273ca9980',
            name: 'PACKAGES',
            label: 'Packages',
            description:
              'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/box.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
        isSubscribed: true,
        isView: true,
      },
    ],
  },
  {
    label: 'PredictoPMS',
    name: 'PREDICT_PMS_HOME',
    icon: 'assets/images/hotel-in-box.png',
    isSubscribed: true,
    isView: true,
    config: [
      {
        name: 'FRONT_DESK_HOME',
        label: 'eFrontdesk',
        description:
          'Never miss an opportunity to connect with guests by automating ',
        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/FrontDesk.svg',
        config: [
          {
            featureId: '951a6698-3850-4dca-bcfd-0a2a3b6859f4',
            name: 'FRONT_DESK_DASHBOARD',
            label: 'Dashboard',
            description:
              'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/Analytics.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '951a6698-3850-4dca-bcfd-0a2a3b6859f4',
            name: 'HOUSEKEEPING',
            label: 'Housekeeping',
            description:
              'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/Analytics.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: 'ed5b8542-49d1-47a3-9bf4-cfa4e73fc668',
            name: 'ADD_RESERVATION',
            label: 'Reservations',
            description:
              'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/box.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '91bb3761-7c3b-47a7-bcef-20b6e4f3f543',
            name: 'ROOM',
            label: 'Room',
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/library.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
        isSubscribed: true,
        isView: true,
      },
      {
        name: 'MEMBERS',
        label: 'Members',
        description: 'Members Module',
        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/subscription_.svg',
        isSubscribed: true,
        isView: true,
        config: [
          {
            featureId: 'ed0d7a6e-1655-493b-84a2-2d90965328f6',
            name: 'GUESTS',
            label: 'Guest ',
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/user.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: 'ed0d7a6e-1655-493b-84a2-2d90965328f6',
            name: 'COMPANY',
            label: 'Company',
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/user.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: 'ed0d7a6e-1655-493b-84a2-2d90965328f6',
            name: 'AGENT',
            label: 'Agent',
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/user.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
      },
      {
        name: 'LIBRARY',
        label: 'Library',
        description:
          'Never miss an opportunity to connect with guests by automating ',
        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/library.svg',
        config: [
          {
            featureId: '3211f5fe-f482-49a9-ba02-230c6c802b0c',
            name: 'OFFERS',
            label: 'Offers',
            description:
              'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/box.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '8e9b7a06-aad9-435e-b338-2c2d42882396',
            name: 'SERVICES',
            label: 'Services',
            description:
              'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/box.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: 'eb78d39a-5000-45b7-a75f-05d273ca9980',
            name: 'PACKAGES',
            label: 'Packages',
            description:
              'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
            cost: {
              cost: 0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/box.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
        isSubscribed: true,
        isView: true,
      },
      {
        name: 'FINANCE',
        label: 'Finance',
        description: 'Finance Module',
        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/money.svg',
        isSubscribed: true,
        isView: true,

        config: [
          {
            featureId: '4164c823-ea1f-427a-ac63-8885f25a7012',
            name: 'INVOICE',
            label: 'Invoice',

            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/subscription_.svg',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '4264c823-ea1f-427a-ac63-8885f25a7012',
            name: 'TRANSACTIONS',
            label: 'Transaction',
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/subscription_.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
      },
    ],
  },
  {
    label: 'Complaint Tacker',
    name: 'COMPLAINT_TRACKER',
    icon: 'assets/images/hotel-in-box.png',
    isSubscribed: true,
    isView: true,
    config: [
      {
        name: 'COMPLAINT_HOME',
        label: 'Home',
        icon: 'assets/images/hotel-in-box.png',
        isSubscribed: true,
        isView: true,
        config: [
          {
            featureId: 'ee8373a4-5ddb-4253-87e7-1bbe093fe220',
            name: 'COMPLAINT_DASHBOARD',
            label: 'Complaint Analytics',
            description:
              'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
            cost: {
              cost: 0.0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon: '',
            isSubscribed: true,
            isView: true,
          },
          {
            featureId: '09a8bbbf-5ab2-43f4-9830-ec201a360e70',
            name: 'COMPLAINTS',
            label: 'Complaint',
            description:
              'Never miss an opportunity to connect with guests by automating communication and strengthening guest relationships',
            cost: {
              cost: 0.0,
              usageLimit: 20000,
            },
            currentUsage: 0,
            icon: '',
            isSubscribed: true,
            isView: true,
          },
        ],
      },
      {
        name: 'MEMBERS',
        label: 'Members',
        description: 'Members Module',
        icon:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/subscription_.svg',
        isSubscribed: true,
        isView: true,
        config: [
          {
            featureId: 'ed0d7a6e-1655-493b-84a2-2d90965328f6',
            name: 'GUESTS',
            label: 'Guest ',
            icon:
              'https://nyc3.digitaloceanspaces.com/botfiles/bot/subscription_icons/user.svg',
            isSubscribed: true,
            isView: true,
          },
        ],
      },
    ],
  },
];
const html = `<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"utf-8\" />\n    <title>Untitled Document</title>\n    <link\n      href=\"https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap\"\n      rel=\"stylesheet\"\n    />\n  </head>\n\n  <body style=\"margin: 0; padding: 0; font-family: 'Roboto', sans-serif\">\n    <div\n      style=\"\n        width: 696px;\n        margin: 0 auto;\n        padding: 45px 40px 40px 40px;\n        border-radius: 25px;\n        background-color: #f9f9f9;\n        font-size: 16px;\n        color: #3b3b3b;\n        font-weight: 300;\n      \"\n    >\n      <table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\n        <tbody>\n          <tr>\n            <td valign=\"middle\" style=\"text-align: center\">\n              <img\n                src=\"https://botfiles.nyc3.cdn.digitaloceanspaces.com/bot/hotel/transactional_feedback/logo/logo.png-removebg-preview.png\"\n                width=\"211\"\n                height=\"66\"\n                alt=\"\"\n              />\n            </td>\n          </tr>\n          <tr>\n            <td height=\"41\"></td>\n          </tr>\n          <tr>\n            <td style=\"text-align: center\" valign=\"bottom\">\n              <img\n                src=\"https://botfiles.nyc3.cdn.digitaloceanspaces.com/bot/hotel/transactional_feedback/logo/Raddison_Blu.jpg\"\n                width=\"696\"\n                height=\"258\"\n                alt=\"\"\n              />\n            </td>\n          </tr>\n          <tr>\n            <td\n              height=\"41\"\n              valign=\"bottom\"\n              style=\"\n                background-color: #fff;\n                padding: 0 30px;\n                text-align: center;\n              \"\n            ></td>\n          </tr>\n          <tr>\n            <td\n              valign=\"top\"\n              style=\"\n                background-color: #fff;\n                padding: 0 30px;\n                text-align: left;\n                font-size: 25px;\n                color: #000;\n                font-weight: bold;\n              \"\n            >\n              <p\n                style=\"\n                  font-size: 25px;\n                  color: #000;\n                  font-weight: bold;\n                  margin: 0;\n                  padding: 0;\n                \"\n              >\n                Hi\n              </p>\n            </td>\n          </tr>\n          <tr>\n            <td\n              height=\"20\"\n              valign=\"bottom\"\n              style=\"\n                background-color: #fff;\n                padding: 0 30px;\n                text-align: center;\n              \"\n            ></td>\n          </tr>\n          <tr>\n            <td\n              valign=\"top\"\n              style=\"background-color: #fff; padding: 0 30px; text-align: left\"\n            >\n              <p\n                style=\"\n                  font-size: 16px;\n                  color: #3b3b3b;\n                  font-weight: 300;\n                  margin: 0;\n                  padding: 0;\n                  line-height: 20px;\n                \"\n              >\n                Thanks for using Radisson Blu. We really appreciate you choosing\n                The Radisson Blu for your travel plans.\n              </p>\n              <p\n                style=\"\n                  font-size: 16px;\n                  color: #3b3b3b;\n                  font-weight: 300;\n                  margin: 0;\n                  padding: 0;\n                  line-height: 20px;\n                \"\n              >\n                <br />\n                To help us improve, we'd love to ask you a few questions about\n                your experience so far. It'll only take 3 minutes, and your\n                answers will help us make Radisson Blu even better for you and\n                other guests.\n              </p>\n              <p\n                style=\"\n                  font-size: 16px;\n                  color: #3b3b3b;\n                  font-weight: 300;\n                  margin: 0;\n                  padding: 0;\n                  line-height: 20px;\n                \"\n              >\n                <br />\n                Thanks,\n              </p>\n              <p\n                style=\"\n                  font-size: 16px;\n                  color: #3b3b3b;\n                  font-weight: 300;\n                  margin: 0;\n                  padding: 0;\n                \"\n              >\n                Radisson Blu Team\n              </p>\n            </td>\n          </tr>\n          <tr>\n            <td\n              height=\"45\"\n              valign=\"top\"\n              style=\"background-color: #fff; padding: 0 30px; text-align: left\"\n            ></td>\n          </tr>\n          <tr>\n            <td\n              valign=\"top\"\n              style=\"background-color: #fff; padding: 0 30px; text-align: left\"\n            >\n              <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n                <tbody>\n                  <tr>\n                    <td style=\"text-align: center\" valign=\"middle\">\n                      <a\n                        href=\"https://bit.ly/3GbsUpK\"\n                        style=\"\n                          display: inline-block;\n                          text-decoration: none;\n                          padding: 13px 0;\n                          background-color: #f03861;\n                          width: 211px;\n                          border-radius: 23px;\n                          color: #fff;\n                        \"\n                      >\n                        Please Share Feedback\n                      </a>\n                    </td>\n                  </tr>\n                </tbody>\n              </table>\n            </td>\n          </tr>\n          <tr>\n            <td\n              valign=\"top\"\n              height=\"35px\"\n              style=\"\n                background-color: #fff;\n                text-align: left;\n                border-radius: 0 0 25px 25px;\n              \"\n            ></td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  </body>\n</html>`;
export const camapign = {
  templateData: {
    checkin: {
      label: 'Check-In',
      templates: [
        {
          templateHtml: html,
        },
        {
          templateHtml: html,
        },
        {
          templateHtml: html,
        },
        {
          templateHtml: html,
        },
      ],
    },
    preCheckIn: {
      label: 'Pre Check-In',
      templates: [
        {
          templateHtml: html,
        },
        {
          templateHtml: html,
        },
        {
          templateHtml: html,
        },
        {
          templateHtml: html,
        },
      ],
    },
    general: {
      label: 'General',
      templates: [
        {
          templateHtml: html,
        },
        {
          templateHtml: html,
        },
        {
          templateHtml: html,
        },
        {
          templateHtml: html,
        },
      ],
    },
  },
  personalization: [
    { label: 'First Name', value: '${firstName}' },
    { label: 'Last Name', value: '${lastName}' },
    { label: 'Email', value: '${email}' },
    { label: 'Company Name', value: '${companyName}' },
    { label: 'City', value: '${city}' },
    { label: 'State', value: '${state}' },
  ],
};

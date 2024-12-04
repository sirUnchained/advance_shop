import request from "request";
import configs from "../configENV";

async function sendSMS(otpCode: string, phone: string) {
  request.post(
    {
      url: "http://ippanel.com/api/select",
      body: {
        op: "pattern",
        user: configs.farazSMS.username,
        pass: configs.farazSMS.password,
        fromNum: configs.farazSMS.formNum,
        toNum: phone,
        patternCode: configs.farazSMS.patternCode,
        inputData: [{ "verification-code": otpCode }],
      },
      json: true,
    },
    function (error, response, body) {
      if (!error && response.statusCode === 200) {
        //YOU‌ CAN‌ CHECK‌ THE‌ RESPONSE‌ AND SEE‌ ERROR‌ OR‌ SUCCESS‌ MESSAGE
        console.log(response.body);
      } else {
        console.log("whatever you want");
      }
    }
  );
}
export default sendSMS;
